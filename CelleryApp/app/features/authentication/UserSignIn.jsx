import React from "react";
import {View, Image} from "react-native";
import {Input, Item, Label, Button, Text, Spinner} from 'native-base';
import {styles} from "../../styles";
import {authApi} from '../../api';

const CelleryLogo = require('../../../assets/Cellery_logo.png');
import {useAuth} from "../../providers/authProvider";
import {COLOURS} from "../../colours";
import {AsyncStorage} from "react-native";
import {getUserObject} from "../../api/authentication";


export function SignInScreen({navigation}) {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [load, setLoad] = React.useState(true);
    const {handleUserSignIn, setJwtTokenAndUserObject} = useAuth();

    React.useEffect(() => {
        async function fetchJwtToken() {
            const userToken = await AsyncStorage.getItem("REQUEST_TOKEN");
            if (userToken) {
                try {
                    const {data} = await getUserObject(userToken);
                    await setJwtTokenAndUserObject(data, userToken);
                } catch (e) {
                    alert(e);
                }
            }
        }

        fetchJwtToken().then(resp => setLoad(false));
    });

    const onUserSignInSubmission = async (username, password) => {
        if (username !== '' && password !== '') {
            try {
                const loginResp = await authApi.userLogin(username, password);
                await handleUserSignIn(loginResp, username);
            } catch (e) {
                //TODO: Use Sweet alert(react-native equivalent)
                alert(e);
                console.log(e);
            }
        } else {
            alert("Please enter your login details");
        }
    }
    return (

        <View style={styles.container}>
            {load ? (<View style={{alignItems: 'center'}}>
                <Spinner color={COLOURS.celleryDarkGrey}/>
                <Text>Fetching User Information....</Text>
            </View>) : (
                <>
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
                            <Button style={[styles.signInActions, {backgroundColor: COLOURS.celleryGreen}]} success
                                    onPress={async () => {
                                        await onUserSignInSubmission(username, password);
                                    }}><Text>Sign In</Text></Button>
                            <Button style={[styles.registerActions, {backgroundColor: COLOURS.cellerySalmon}]}
                                    title="Register"
                                    onPress={() => {
                                        navigation.navigate('Sign up');
                                    }}><Text>Sign up with email</Text></Button>
                        </View>

                    </View>
                </>)}

        </View>
    );
}

