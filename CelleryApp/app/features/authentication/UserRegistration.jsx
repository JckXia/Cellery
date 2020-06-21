import * as Yup from "yup";
import React from "react";
import {Formik} from "formik";
import {Button, Text, TextInput, View} from "react-native";
import {useAuth} from "../../providers/authProvider";
import Axios from "axios";

const REGISTER_URL = 'http://172.20.0.1:8080/users/create';
export function FormikSignUpForm({navigation}) {

    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email, try again!')
            .required('Required'),
        firstName: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
    });
    const formData = {
        email: '',
        firstName: '',
        lastName: '',
        password:'',
    };

    const {onUserRegistration} = useAuth();
    const onSignUpButtonPressed = async (newUserInfo) => {
        console.log(`NEW USER INFO `,newUserInfo);
        try {
            const userSignUpResp = await Axios.post(REGISTER_URL, {
                email: newUserInfo.email,
                firstName: newUserInfo.firstName,
                lastName: newUserInfo.lastName,
                password: newUserInfo.password
            });
            console.log(`USER SIGN UP RESP `,userSignUpResp);
            await onUserRegistration(newUserInfo.firstName,newUserInfo.lastName);
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
                <View>
                    <TextInput
                        placeholder={"email"}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                    />
                    {errors.email ? (<Text>{errors.email}</Text>) : null}
                    <TextInput
                        placeholder={"first name"}
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                    />
                    {errors.firstName ? (<Text>{errors.firstName}</Text>) : null}
                    <TextInput
                        placeholder={"last name"}
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                    />
                    <TextInput
                        placeholder={"password"}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                    />
                    <Button onPress={handleSubmit} title="Submit"/>
                    <Button title="Sign in" onPress={() => {
                        navigation.navigate('Sign in');
                    }}/>
                </View>
            )}
        </Formik>
    );
}
