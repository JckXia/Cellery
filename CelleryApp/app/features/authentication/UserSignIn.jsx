import React from "react";
import {View, Image} from "react-native";
import {Input, Item, Label, Button, Text} from 'native-base';
import {styles} from "../../styles";
import {authApi} from '../../api';
const CelleryLogo = require('../../../assets/Cellery_logo.png');
import {useAuth} from "../../providers/authProvider";
import {COLOURS} from "../../colours";


export function SignInScreen({navigation}) {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {handleUserSignIn} = useAuth();

    const onUserSignInSubmission = async (username, password) => {
        try {
            const loginResp = await authApi.userLogin(username, password);
            await handleUserSignIn(loginResp, username);
        } catch (e) {
            //TODO: Use Sweet alert(react-native equivalent)
            alert(e);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.logo}
                    source={CelleryLogo}
                />
            </View>

            <View styles={styles.inputContainer}>
                <Item stackedLabel style={{marginBottom: 20}}>
                    <Label>Email</Label>
                    <Item style={{backgroundColor: COLOURS.inputBg}}>
                        <Input
                            value={username}
                            onChangeText={setUsername}
                        />
                    </Item>
                </Item>

                <Item stackedLabel>
                    <Label>Password</Label>
                    <Item style={{backgroundColor: COLOURS.inputBg}}>
                        <Input
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                    </Item>
                </Item>

                <View style={styles.userAuthOptions}>
                    <Button style={styles.signInActions} success onPress={async () => {
                        await onUserSignInSubmission(username, password);
                    }}><Text>Sign In</Text></Button>
                    <Button style={[styles.registerActions, {backgroundColor: COLOURS.cellerySalmon}]} title="Register" onPress={() => {
                        navigation.navigate('Sign up');
                    }}><Text>Sign up with email</Text></Button>
                </View>

            </View>

        </View>
    );
}

