import Axios from "axios";

const LOGIN_URL='http://10.0.2.2:8080/users/login';
const REGISTER_URL = 'http://10.0.2.2:8080/users/create';

export async function userLogin(email,password){
   return await Axios.post(LOGIN_URL,{
       email:email,
       password:password
    });
}

export async function userRegistration(email,firstName,lastName,password){
    return await Axios.post(REGISTER_URL,{
       email,
       firstName,
       lastName,
       password
    });
}
