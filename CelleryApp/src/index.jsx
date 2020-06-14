import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {ScrollView} from "react-native";
import {FlatList} from "react-native";

const initalState = {
    meetup: {
        value: 'foo',
        title: 'Online meetups',
        date: Date(),
        attendees: ['Bob', 'Jessy', 'Christina', 'Adam']
    },
    user: {
        name: 'Roy'
    },
    currentUserLoggedIn: {
        id: '',
        userName: '',
        jwtToken: ''
    }
}

const MeetupContext = React.createContext();
const UserContext = React.createContext();

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
        case 'subscribeUser':
            return {
                ...state,
                attendees: [...state.attendees, action.payload],
                subscribed: true
            };
        case 'unSubscribeUser':
            return {
                ...state,
                attendees: state.attendees.filter(
                    attendee => attendee !== action.payload
                ),
                subscribed: false
            };
        default:
            return state;
    }
}

const AuthContextProvider = ({...props}) => {
    const [state, dispatch] = React.useReducer(reducer, initalState.currentUserLoggedIn);
    return (
        <AuthContext.Provider value={{
            ...state,
            onSuccessfulAuthentication: (userName, userId, jwtToken) => dispatch({
                type: 'successfullyAuthenticated',
                payload: {id: userId, userName: userName, jwtToken: jwtToken}
            }),
            onSuccessfullLogout: () => dispatch({
                type: 'successfullyLoggedOut',
                payload: {id: '', userName: '', jwtToken: ''}
            })
        }}>
            {props.children}
        </AuthContext.Provider>
    )
};

const MeetupContextProvider = ({user, ...props}) => {
    const [state, dispatch] = React.useReducer(reducer, initalState.meetup);
    return (
        <MeetupContext.Provider value={{
            ...state,
            handleSubscribe: () => dispatch({type: 'subscribeUser', payload: user.name}),
            handleUnsubscribe: () => dispatch({type: 'unSubscribeUser', payload: user.name})
        }}>
            {props.children}
        </MeetupContext.Provider>
    )
}

function testCheckingUserObjectFunction(userObj){
    console.log(userObj);
    // userObj.onSuccessfulAuthentication('JackXia','12345','anmasvnasd');
    return(
        <View>
            <Text>{userObj.userName}</Text>
            <Button title={'Click me'} onPress={()=>{userObj.onSuccessfulAuthentication('Jack','1234','12412d')}}/>
        </View>
    )
}


export default function App() {
    const [state, updateState] = React.useState(initalState);
    console.log('init state ', initalState);
    return <AuthContextProvider values={initalState.currentUserLoggedIn}>
        <AuthContext.Consumer>
            {userObj=>(testCheckingUserObjectFunction(userObj))}
        </AuthContext.Consumer>
    </AuthContextProvider>
};
