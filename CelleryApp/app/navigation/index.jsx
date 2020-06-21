import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Dashboard} from '../features/dashboard/index';
import {SignInScreen} from '../features/authentication/UserSignUp';
import {FormikSignUpForm} from '../features/authentication/UserRegistration';
import AuthContextProvider, {AuthContext} from "../providers/authProvider";


const Stack = createStackNavigator();
export default function Navigator(props) {
    return (
        <AuthContextProvider>
            <AuthContext.Consumer>
                {({state}) => (
                    <NavigationContainer>
                        <Stack.Navigator>
                            {state.jwtToken ? (<Stack.Screen name={'home'} component={Dashboard}/>) : (
                                <>
                                    <Stack.Screen name={'Sign in'} component={SignInScreen}/>
                                    <Stack.Screen name={'Sign up'} component={FormikSignUpForm}/>
                                </>
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
            </AuthContext.Consumer>
        </AuthContextProvider>
    )
}
