import {Button, TextInput, View} from "react-native";

export function SignInScreen({navigation}) {
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
