import {createStackNavigator} from "react-navigation-stack";
import {NavigationContainer} from "@react-navigation/native";
import {Button, TextInput, View} from "react-native";

const Stack = createStackNavigator();

function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { onSignInSubmit} = React.useContext(AuthContext);
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
            <Button title="Sign ind" onPress={() => { console.log(`Clicked`); onSignInSubmit(username,password)}} />
        </View>
    );
}

function SignUp(){
    return(
        <View><Text>Sign Up here</Text></View>
    )
}


export const AuthComponents = () =>{
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'Sign in'} />
                <Stack.Screen name={'Sign up'}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
