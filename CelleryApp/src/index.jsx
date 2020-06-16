import React, {useState} from 'react';
import {AsyncStorage, StyleSheet, Text, View, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Axios from "axios";


const LOGIN_URL ='http://172.29.240.1:8080/users/login';

const REGISTER_URL='http://172.29.240.1:8080/users/create';

const initalState = {
    currentUserLoggedIn: {
        id: null,
        userName: null,
        jwtToken: null
    }
}

const AuthContext = React.createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'successfullyAuthenticated':
             return {
                 ...state,
                 id:action.payload.id,
                 userName:action.payload.userName,
                 jwtToken:action.payload.jwtToken,
             };
        case 'successfullyRegistered':
            return state;
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
            onSignInSubmit: async (email,password) => {
                try {
                    const loginReq = await Axios.post('http://172.31.112.1:8080/users/login',
                        {
                            password: password,
                            email: email
                        });
                    console.log(`LOGIN REQ `,loginReq);
                    await AsyncStorage.setItem('REQUEST_TOKEN',loginReq.headers.token);
                    dispatch({
                        type: 'successfullyAuthenticated',
                        payload: {jwtToken: loginReq.headers.token}
                    })
                }catch(e){
                    console.log(`ERRO! `,e);
                }
            },
            onSuccessfulAuthentication: (userName, userId, jwtToken) =>{
                console.log(`USERNAME `,userName);
                dispatch({
                    type: 'successfullyAuthenticated',
                    payload: {id: userId, userName: userName, jwtToken: jwtToken}
                })
            } ,
            onSuccessfullLogout: () => dispatch({
                type: 'successfullyLoggedOut',
                payload: {id: '', userName: '', jwtToken: ''}
            })
        }}>
            {props.children}
        </AuthContext.Provider>
    )
};


function testCheckingUserObjectFunction(userObj){
    return(
        <View>
            <Text>{userObj.userName}</Text>
            <Button title={'Click me'} onPress={()=>{userObj.onSuccessfulAuthentication('My Smol Bol','1234','12412d')}}/>
        </View>
    )
}

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

const Stack = createStackNavigator();
export default function App() {
    const [state, updateState] = React.useState(initalState);
    console.log('State ',state);
    return <AuthContextProvider values={initalState.currentUserLoggedIn}>
        <NavigationContainer>
            <Stack.Navigator>
                {state.jwtToken?(<Stack.Screen name={'home'} component={<Text>Hu</Text>} /> )
                    : (<Stack.Screen  name={'Sign in'} component={SignInScreen}/>) }
            </Stack.Navigator>
        </NavigationContainer>
    </AuthContextProvider>
};
