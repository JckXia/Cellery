import * as React from 'react';
import Axios from "axios";
import { AsyncStorage, Button, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AuthContext = React.createContext();

function SplashScreen() {
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}

function HomeScreen() {
    const { signOut } = React.useContext(AuthContext);

    return (
        <View>
            <Text>Signed in!</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    );
}

function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { signIn } = React.useContext(AuthContext);

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign in" onPress={() => signIn({ username, password })} />
        </View>
    );
}

function SignUpScreen(){
   const [username,setUsername] = React.useState('');
   const [email, setEmail] = React.useState('');
   const [password,setPassword] = React.useState('');

   const {signUp} = React.useContext(AuthContext);

   return(
       <View>
           <TextInput
               placeholder="Username"
               value={username}
               onChangeText={setUsername}
           />
           <TextInput
               placeholder="Email"
               value={email}
               onChangeText={setEmail}
           />
           <TextInput
               placeholder="Password"
               value={password}
               onChangeText={setPassword}
               secureTextEntry
           />
           <Button title={"Sign up"} onPress={()=>signUp({username,email,password})} />
       </View>
   );
}


const Stack = createStackNavigator();

export default function App({ navigation }) {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('userToken');
                console.log('Token ',userToken);
            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps

            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                // In a production app, we need to send some data (usually username, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token
                try {
                    let email = `xiajack${Math.random()}@gmail.com`
                    const req = await Axios.post('http://172.29.240.1:8080/users/create',
                        {
                            firstName: "check",
                            lastName: "bas",
                            password: "123",
                            email: email
                        });

                    const loginReq = await Axios.post('http://172.29.240.1:8080/users/login',
                        {
                            password: "123",
                            email: email
                        });
                    console.log(`LOGIN `,loginReq);
                    console.log('REQUEST ',loginReq.headers.token);
                    await AsyncStorage.setItem('REQUEST_TOKEN',loginReq.headers.token);
                    const getTokenFromStorage = await AsyncStorage.getItem('REQUEST_TOKEN');
                    console.log(`RETRIEVE TOKEN FROM STORAGE `,getTokenFromStorage);
                }catch(e){
                    console.log(e);
                }
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                // In a production app, we need to send user data to server and get a token
                // We will also need to handle errors if sign up failed
                // After getting token, we need to persist the token using `AsyncStorage`
                // In the example, we'll use a dummy token

                dispatch({ type: 'SIGN_UP', token: 'dummy-auth-token' });
            },
        }),
        []
    );

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {state.isLoading ? (
                        // We haven't finished checking for the token yet
                        <Stack.Screen name="Splash" component={SplashScreen} />
                    ) : state.userToken == null ? (
                        // No token found, user isn't signed in
                        <Stack.Screen
                            name="SignInd"
                            component={SignInScreen}
                            options={{
                                title: 'Sign in',
                                // When logging out, a pop animation feels intuitive
                                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                            }}
                        />
                    ) : (
                        // User is signed in
                        <Stack.Screen name="Home" component={HomeScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
}
