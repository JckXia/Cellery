import React from "react";
import { View, Image} from "react-native";
import {Input, Item, Label, Button,Text} from 'native-base';

const CelleryLogo = require('../../../assets/Cellery_logo.png');
import {useAuth} from "../../providers/authProvider";
import Axios from 'axios';


//TODO: Because we are using emulators, we have to find a way to forward the port

const LOGIN_URL='http://10.0.2.2:8080/users/login';
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
                <Item  stackedLabel style={{marginBottom: 20}}>
                    <Label>Email</Label>
                    <Item style={{backgroundColor: '#D3D3D3'}}>
                        <Input
                            value={username}
                            onChangeText={setUsername}
                        />
                    </Item>
                </Item>

                <Item stackedLabel>
                    <Label>Password</Label>
                    <Item style={{backgroundColor: '#D3D3D3'}}>
                        <Input
                            value={password}
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                    </Item>
                </Item>

                <View style={styles.userAuthActions}>
                    <Button  style={styles.signInActions}  success onPress={async () => {
                        await onUserSignInSubmission(username, password);
                    }}><Text>Sign In using email</Text></Button>
                    <Button  style={styles.registerActions}  title="Register" onPress={() => {
                        navigation.navigate('Sign up');
                    }}><Text>Sign up with email</Text></Button>
                </View>

            </View>

        </View>
    );
}


//TODO refactor this into global file, such taht
//styles can be imported
const styles = {
    container: {
        margin: 40,
        flex: 1
    },
    logo: {
        width: 180,
        height: 180,
    },
    imageContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        margin: 45
    },
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    signInActions:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:15
    },
    registerActions:{
        justifyContent:'center',
        alignItems:'center',
    },
    userAuthActions:{
        justifyContent:'space-between',
        margin:40
    }
};
