import React, {useState} from 'react';
import {AsyncStorage, StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Formik} from 'formik';
import Axios from "axios";
import * as Yup from 'yup';

//TODO: WE NEED TO FIND A WAY TO FORWARD PORTS INTO THE AVD
const LOGIN_URL = 'http://172.20.0.1:8080/users/login';

const REGISTER_URL = 'http://172.20.0.1:8080/users/create';

const initalState = {
    currentUserLoggedIn: {
        id: null,
        userName: null,
        jwtToken: null,
        isRegistered: false
    }
}

const AuthContext = React.createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'successfullyAuthenticated':
            return {
                ...state,
                id: action.payload.id,
                userName: action.payload.userName,
                jwtToken: action.payload.jwtToken,
            };
        case 'successfullyRegistered':
            return {
                ...state,
                isRegistered: true
            };
        case 'successfullyLoggedOut':
            return state;
        default:
            return state;
    }
}

const AuthContextProvider = ({...props}) => {
    const [state, dispatch] = React.useReducer(reducer, initalState.currentUserLoggedIn);
    return (
        <AuthContext.Provider value={{
            ...state,
            onSignInSubmit: async (email, password) => {
                const loginReq = await Axios.post(LOGIN_URL,
                    {
                        password: password,
                        email: email
                    });
                await AsyncStorage.setItem('REQUEST_TOKEN', loginReq.headers.token);
                dispatch({
                    type: 'successfullyAuthenticated',
                    payload: {jwtToken: loginReq.headers.token}
                })
            },
            onSignUpSubmission: async (email, password, firstName, lastName) => {
                const signUpRequest = await Axios.post(REGISTER_URL,
                    {
                        firstName,
                        email,
                        password,
                        lastName
                    });
                console.log('SIGN up request ', signUpRequest);
                dispatch({
                    type: 'successfullyRegistered',
                    payload: {user: `${firstName}_${lastName}`}
                })
            },
            onSuccessfulAuthentication: (userName, userId, jwtToken) => {
                console.log(`USERNAME `, userName);
                dispatch({
                    type: 'successfullyAuthenticated',
                    payload: {id: userId, userName: userName, jwtToken: jwtToken}
                })
            },
            onSuccessfullLogout: () => dispatch({
                type: 'successfullyLoggedOut',
                payload: {id: '', userName: '', jwtToken: ''}
            })
        }}>
            {props.children}
        </AuthContext.Provider>
    )
};

function FormikSignUpForm({navigation}) {

    const signUpSchema = Yup.object().shape({
        email:Yup.string()
            .email('Invalid email, try again!')
            .required('Required'),
        firstName:Yup.string()
            .min(2,'Too Short!')
            .max(50,'Too Long!')
            .required('Required'),
    });
    const formData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    };

    const {onSignUpSubmission} = React.useContext(AuthContext);
    const onSignUpButtonPressed = async (newUserInfo) => {
        try {
            await onSignUpSubmission(newUserInfo.email, newUserInfo.password, newUserInfo.firstName, newUserInfo.lastName);
            navigation.navigate('Sign in');
        } catch (e) {
            alert(e);
        }
    };
    return (
        <Formik
            initialValues={formData}
            onSubmit={values => onSignUpButtonPressed(values)}
            validationSchema={signUpSchema}
            validateOnBlur={false}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors,touched}) => (
                <View>
                    <TextInput
                        placeholder={"email"}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                    />
                    {errors.email ? (<Text>{errors.email}</Text>):null}
                    <TextInput
                        placeholder={"first name"}
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                    />
                    {errors.firstName ? (<Text>{errors.firstName}</Text>):null}
                    <TextInput
                        placeholder={"last name"}
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                    />
                    <TextInput
                        placeholder={"password"}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                    />
                    <Button onPress={handleSubmit} title="Submit"/>
                    <Button title="Sign in" onPress={() => {
                        navigation.navigate('Sign in');
                    }}/>
                </View>
            )}
        </Formik>
    );
}

function SignInScreen({navigation}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {onSignInSubmit} = React.useContext(AuthContext);

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
            <Button title="Sign in" onPress={async () => {
                await onSignInSubmit(username, password);
            }}/>
            <Button title="Register" onPress={() => {
                navigation.navigate('Sign up');
            }}/>
        </View>
    );
}

function Home() {
    return (
        <View>
            <Text>Home sweet home</Text>
        </View>
    );
}

const Stack = createStackNavigator();
export default function App() {

    React.useEffect(() => {
        //TODO: Once we retrieve the token from the Async storage, add end pt
        //to verify jwt token
        console.log(`HOOK CALLED!`);
    });

    return <AuthContextProvider values={initalState.currentUserLoggedIn}>
        <AuthContext.Consumer>
            {state => (
                <NavigationContainer>
                    <Stack.Navigator>
                        {state.jwtToken ? (<Stack.Screen name={'home'} component={Home}/>)
                            : (<>
                                <Stack.Screen name={'Sign in'} component={SignInScreen}/>
                                <Stack.Screen name={'Sign up'} component={FormikSignUpForm}/>
                            </>)}
                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </AuthContext.Consumer>

    </AuthContextProvider>
};
