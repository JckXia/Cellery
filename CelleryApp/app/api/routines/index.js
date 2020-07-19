import Axios from "../axios";
import {ROUTINES_URL, REMOVE_FROM_ROUTINE_URL, ADD_TO_ROUTINE_URL} from 'react-native-dotenv';


export async function userRoutines(token) {
    return await Axios.get(ROUTINES_URL, {headers: { Authorization: `Bearer ${token}` }});
}

export async function createRoutine(products, token) {
    return await Axios.post(ROUTINES_URL,
        {
            // TODO: need am/pm note?
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function deleteRoutine(id, token) {
    return await Axios.delete(`${ROUTINES_URL}/${id}`, {headers: { Authorization: `Bearer ${token}` }});
}

export async function removeProductsFromRoutine(id, products, token) {
    return await Axios.patch(`${REMOVE_FROM_ROUTINE_URL}${id}`,
        {
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function addProductsToRoutine(id, products, token) {
    return await Axios.patch(`${ADD_TO_ROUTINE_URL}${id}`,
        {
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}
