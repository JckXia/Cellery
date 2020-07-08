import Axios from "axios";

const LOGIN_URL='http://10.0.0.55:5000/users/login';
const REGISTER_URL = 'http://10.0.0.55:5000/users/create';

export async function userLogin(email,password){
   return await Axios.post(LOGIN_URL,{
       email:email,
       password:password
    });
}

export async function userRegistration(email,userName,password){
    return await Axios.post(REGISTER_URL,{
       email:email,
       userName:userName,
       password:password
    });
}
