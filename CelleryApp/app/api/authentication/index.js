import Axios from "../axios";
import {LOGIN_URL, REGISTER_URL,USER_VERIFICATION_URL} from 'react-native-dotenv';

export async function userLogin(email,password){
   return await Axios.post(LOGIN_URL,{
       email:email,
       password:password
    });
}

export async function getUserObject(jwtToken){
    return await Axios.post(USER_VERIFICATION_URL,{
        jwtToken
    },{headers: { Authorization: `Bearer ${jwtToken}` }});
}

export async function userRegistration(email,userName,password){
    return await Axios.post(REGISTER_URL,{
       email:email,
       userName:userName,
       password:password
    });
}
