import React from 'react';
import {authReducer, initialState} from './reducer'
import {AsyncStorage} from "react-native";

const AuthContext = React.createContext();

export const AuthContextProvider = (props) => {
    const [state, dispatch] = React.useReducer(authReducer, initialState.currentUserLoggedIn);

    const onUserRegistration = async (firstName,lastName) => {
        dispatch({
            type: 'successfullyRegistered',
            payload: {user: `${firstName}_${lastName}`}
        });
    };

    const handleUserSignIn = async (loginResp) => {
        await AsyncStorage.setItem('REQUEST_TOKEN', loginResp.headers.token);
        dispatch({
            type: 'successfullyAuthenticated',
            payload: {jwtToken: loginResp.headers.token}
        });
    }

    const handleUserLogOut = async (logOutResp)=>{
        await AsyncStorage.removeItem('REQUEST_TOKEN');
        dispatch({
           type:'successfullyLoggedOut',
           payload:{jwtToken:'',user:''}
        });
    };

    const value = React.useMemo(() => {
        return {state, onUserRegistration, handleUserSignIn}
    }, [state]);
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
};

const useAuth = () => React.useContext(AuthContext);
export {AuthContext, useAuth};
export default AuthContextProvider;

