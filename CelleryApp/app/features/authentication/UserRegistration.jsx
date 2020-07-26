import * as Yup from "yup";
import React from "react";
import {Formik} from "formik";
import {View} from "react-native";
import {Input, Item, Label, Button, Text, H1} from 'native-base';
import {styles} from '../../styles';
import {authApi} from '../../api';
import {useAuth} from "../../providers/authProvider";
import AlertAsync from "react-native-alert-async";
import {COLOURS} from "../../colours";


export function FormikSignUpForm({navigation}) {

    const signUpSchema = Yup.object().shape({
        userName: Yup.string()
            .min(5, 'Username is too short!')
            .max(255, 'Username is too long!')
            .required('Required'),
        email: Yup.string()
            .email('Invalid email, try again!')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Password is too short')
            .required('Required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords don't match")
            .required('Required')
    });
    const formData = {
        userName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    };

    const {onUserRegistration} = useAuth();
    const onSignUpButtonPressed = async (newUserInfo) => {
        try {

            await authApi.userRegistration(newUserInfo.email, newUserInfo.userName, newUserInfo.password);
            await onUserRegistration();

            await AlertAsync(
                'Yay!',
                'Your account has been successfully created.',
                [
                    {text: 'Ok', onPress: () => Promise.resolve('ok')}
                    ],
                {cancelable: false, onDismiss: () => "ok"}
            );

            navigation.navigate('Sign in');
        } catch (e) {
            alert(e);
        }
    };
    return (
        <Formik
            initialValues={formData}
            onSubmit={values => onSignUpButtonPressed(values)}
            validationSchema={signUpSchema}
            validateOnBlur={false}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <View style={styles.container}>
                    <View style={styles.accountRegistrationHeader}>
                        <H1 style={styles.headerTextStyle}>Create Your </H1>
                        <H1 style={styles.headerTextStyle}>Cellery Account</H1>
                    </View>
                    <View style={styles.inputContainer}>
                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Username</Label>
                            <Item style={{backgroundColor: COLOURS.inputBg}}>
                                <Input
                                    value={values.userName}
                                    onChangeText={handleChange('userName')}
                                />
                            </Item>
                        </Item>
                        {errors.userName ? (<Text>{errors.userName}</Text>) : null}

                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Email</Label>
                            <Item style={{backgroundColor: COLOURS.inputBg}}>
                                <Input
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                />
                            </Item>
                        </Item>
                        {errors.email ? (<Text>{errors.email}</Text>) : null}

                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Password</Label>
                            <Item style={{backgroundColor: COLOURS.inputBg}}>
                                <Input
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    secureTextEntry
                                />
                            </Item>
                        </Item>
                        {errors.password ? (<Text>{errors.password}</Text>) : null}

                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Re-enter password</Label>
                            <Item style={{backgroundColor: COLOURS.inputBg}}>
                                <Input
                                    value={values.passwordConfirmation}
                                    onChangeText={handleChange('passwordConfirmation')}
                                    secureTextEntry
                                />
                            </Item>
                        </Item>
                        {errors.passwordConfirmation ? (<Text>{errors.passwordConfirmation}</Text>) : null}

                    </View>
                    <View style={styles.userAuthActions}>
                        <Button style={styles.signInActions} success onPress={handleSubmit} title="Submit">
                            <Text>
                                Create Account
                            </Text>
                        </Button>
                        <Button style={[styles.registerActions, {backgroundColor: COLOURS.celleryDarkGrey}]} title="Sign in" onPress={() => {
                            navigation.navigate('Sign in');
                        }}>
                            <Text>
                                Back to Login
                            </Text>
                        </Button>
                    </View>

                </View>
            )}
        </Formik>
    );
}

