import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Dashboard} from '../features/dashboard/index';
import * as Font from 'expo-font';
import {Ionicons} from '@expo/vector-icons';
import {SignInScreen} from '../features/authentication/UserSignIn';
import {FormikSignUpForm} from '../features/authentication/UserRegistration';
import AuthContextProvider, {AuthContext, useAuth} from "../providers/authProvider";
import {Routines} from '../features/routines/Routines';
import {Products} from "../features/products/Products";
import {ProductForm} from "../features/products/ProductForm";
import {RoutineEdit} from "../features/routines/RoutineEdit";
import {AppLoading} from "expo";
import {AsyncStorage} from "react-native";
import {getUserObject} from "../api/authentication";


const Stack = createStackNavigator();
export default function Navigator() {
    const [load, setLoad] = React.useState(false);
    const authReducer = useAuth();
    React.useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                Roboto: require('native-base/Fonts/Roboto.ttf'),
                Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
                ...Ionicons.font,
            });
            const userToken = await AsyncStorage.getItem('REQUEST_TOKEN');
            if (userToken) {
                try {
                  //  const {data} = await getUserObject(userToken);
                  //  console.log('USER OBJECT ', data);
                  //  console.log('Test ', AuthContext);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        loadFont().then(resp => setLoad(true));
    }, []);

    const defaultProductFormParams = {
        productId: '',
        name: '',
        description: ''
    };

    const defaultRoutineParams = {
        routineId: '',
        products: [],
        isAm: null
    }

    if (!load) {
        return (
            <AppLoading/>
        );
    } else {
        return (
            <AuthContextProvider>
                <AuthContext.Consumer>
                    {({state}) => (
                        <NavigationContainer>
                            <Stack.Navigator screenOptions={{headerShown: false}}>
                                {state.jwtToken ?
                                    (
                                        <>
                                            <Stack.Screen name={'home'} component={Dashboard}/>
                                            <Stack.Screen name={'routines'} component={Routines}/>
                                            <Stack.Screen name={'products'} component={Products}/>
                                            <Stack.Screen name={'Product form'} component={ProductForm}
                                                          initialParams={defaultProductFormParams}/>
                                            <Stack.Screen name={'Routine edit'} component={RoutineEdit}
                                                          initialParams={defaultRoutineParams}/>
                                        </>

                                    ) : (
                                        <>
                                            <Stack.Screen name={'Sign in'} component={SignInScreen}/>
                                            <Stack.Screen name={'Sign up'} component={FormikSignUpForm}/>
                                        </>
                                    )}
                            </Stack.Navigator>
                        </NavigationContainer>
                    )}
                </AuthContext.Consumer>
            </AuthContextProvider>
        );
    }
}
