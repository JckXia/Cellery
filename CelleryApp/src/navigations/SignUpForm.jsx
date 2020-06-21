import React from "react";
import {Button, TextInput, View} from "react-native";
import {useAuth} from "../../app/providers/authProvider";

function SignInScreen({navigation}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {handleUserSignIn} = useAuth();

    const onSubmit = async () => {

        try {
            const userLoginResponse = await Axios.post('', {
                password: password,
                email: username
            });
            console.log(`USER LOGIN RESP `, userLoginResponse);
            await handleUserSignIn(userLoginResponse);
            //  navigation.navigate('Sign in');
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
                await onSubmit();
            }}/>
            <Button title="Register" onPress={() => {
                navigation.navigate('Sign up');
            }}/>
        </View>
    );
}
