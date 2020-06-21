import React from "react";
import {Button, TextInput, View} from "react-native";
import {useAuth} from "../../providers/authProvider";
import Axios from 'axios';


const LOGIN_URL = 'http://172.20.0.1:8080/users/login';

export function SignInScreen({navigation}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {handleUserSignIn} = useAuth();

    const onUserSignInSubmission = async (username, password) => {
        try {
            const loginResp = await Axios.post(LOGIN_URL, {
                email: username,
                password: password
            });
            await handleUserSignIn(loginResp);
        } catch (e) {
            alert(e);
        }
    }
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
                await onUserSignInSubmission(username, password);
            }}/>
            <Button title="Register" onPress={() => {
                navigation.navigate('Sign up');
            }}/>
        </View>
    );
}
