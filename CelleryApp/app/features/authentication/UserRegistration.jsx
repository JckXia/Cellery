import * as Yup from "yup";
import React from "react";
import {Formik} from "formik";
import {View} from "react-native";
import {Input, Item, Label, Button, Text ,H1} from 'native-base';
import { styles }from '../../styles';
import {authApi} from '../../api';
import {useAuth} from "../../providers/authProvider";

export function FormikSignUpForm({navigation}) {

    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email, try again!')
            .required('Required'),
        firstName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        lastName: Yup.string()
            .min(2, 'Last name is too short!')
            .max(50, 'Last name is too long')
            .required('Required'),
        password: Yup.string()
            .min(8, 'password too short')
            .required('Required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords don't match")
            .required('Required')
    });
    const formData = {
        email: '',
        firstName: 'Jack',
        lastName: 'Xia',
        userName: '',
        password: '',
        passwordConfirmation: ''
    };

    const {onUserRegistration} = useAuth();
    const onSignUpButtonPressed = async (newUserInfo) => {
        try {

         await  authApi.userRegistration(newUserInfo.email,newUserInfo.firstName,newUserInfo.lastName,newUserInfo.password);
         await onUserRegistration(newUserInfo.firstName, newUserInfo.lastName);
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
                        <H1 style={styles.headerTextStyle} >Create Your  </H1>
                        <H1 style={styles.headerTextStyle}>Cellery Account</H1>
                    </View>
                    <View style={styles.inputContainer}>
                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Username</Label>
                            <Item style={{backgroundColor: '#D3D3D3'}}>
                                <Input
                                    value={values.userName}
                                    onChangeText={handleChange('userName')}
                                />
                            </Item>
                        </Item>
                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Email</Label>
                            <Item style={{backgroundColor: '#D3D3D3'}}>
                                <Input
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                />
                            </Item>
                        </Item>
                        {errors.email ? (<Text>{errors.email}</Text>) : null}
                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Password</Label>
                            <Item style={{backgroundColor: '#D3D3D3'}}>
                                <Input
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    secureTextEntry
                                />
                            </Item>
                        </Item>

                        <Item stackedLabel style={{marginBottom: 20}}>
                            <Label>Re-enter password</Label>
                            <Item style={{backgroundColor: '#D3D3D3'}}>
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
                        <Button style={styles.registerActions} title="Sign in" onPress={() => {
                            navigation.navigate('Sign in');
                        }}>
                            <Text>
                                Sign In
                            </Text>
                        </Button>
                    </View>

                </View>
            )}
        </Formik>
    );
}

