import React from 'react';

import LoginScreen from "../../../src/scenes/login";
import {createStackNavigator} from "@react-navigation/stack";

const AuthStack = createStackNavigator({
    Login:LoginScreen
},{
    initialRouteName:'Login'
});

export default AuthStack
