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
    }
}

const MeetupContext = React.createContext();
const UserContext = React.createContext();

const reducer = (state,action)=>{
    switch(action.type){
        case 'subscribeUser':
            return {
                ...state,
                attendees: [...state.attendees,action.payload],
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

const renderMeetup = (meetupObject) => {
    console.log(`MEETUP handler`,meetupObject.subscribed);
    return (
        <View>
            <Text>{meetupObject.title}</Text>
            <Text>{meetupObject.date}</Text>
            <Text>{`There are in total ${meetupObject.attendees.length} attendees in total`}</Text>
            {meetupObject.attendees.map(attendant => (
                <Text>{attendant}</Text>

            ))}
            {!meetupObject.subscribed? (<Button title={'Subscribe'} onPress={meetupObject.handleSubscribe} />):(<Button title={`Unsubscribe`} onPress={meetupObject.handleUnsubscribe}/>)}
        </View>
    )
};


export default function App() {
    const [state, updateState] = React.useState(initalState);
    console.log('init state ', initalState);
    return <UserContext.Provider value={initalState.user}>
        <UserContext.Consumer>
            {user => (
                <MeetupContextProvider user={user}>
                    <MeetupContext.Consumer>
                        {meetup =>renderMeetup(meetup)}
                    </MeetupContext.Consumer>
                </MeetupContextProvider>
                )}
        </UserContext.Consumer>
    </UserContext.Provider>
};
