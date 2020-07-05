import React from 'react';
import {authReducer, initialState} from './reducer'
import {AsyncStorage} from "react-native";
import {USER_SUCCESSFUL_AUTHENTICATED, USER_SUCCESSFUL_LOGOUT, USER_SUCCESSFUL_REGISTER} from '../actions'

const AuthContext = React.createContext();

export const AuthContextProvider = (props) => {
    const [state, dispatch] = React.useReducer(authReducer, initialState.currentUserLoggedIn);

    const onUserRegistration = async () => {
        dispatch({
            type: USER_SUCCESSFUL_REGISTER
        });
    };

    const handleUserSignIn = async (loginResp, username) => {
        await AsyncStorage.setItem('REQUEST_TOKEN', loginResp.headers.token);
        dispatch({
            type: USER_SUCCESSFUL_AUTHENTICATED,
            payload: {jwtToken: loginResp.headers.token, userName: username}
        });
    }

    const handleUserLogOut = async ()=>{
        await AsyncStorage.removeItem('REQUEST_TOKEN');
        dispatch({
           type:USER_SUCCESSFUL_LOGOUT,
           payload:{jwtToken:'',user:''}
        });
    };

    const value = React.useMemo(() => {
        return {state, onUserRegistration, handleUserSignIn,handleUserLogOut}
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

