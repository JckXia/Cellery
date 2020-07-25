import Axios from "../axios";
import {ROUTINES_URL, REMOVE_FROM_ROUTINE_URL, ADD_TO_ROUTINE_URL} from 'react-native-dotenv';


export async function userRoutines(token) {
    return await Axios.get(ROUTINES_URL, {headers: { Authorization: `Bearer ${token}` }});
}

export async function createRoutine(products, isAm, token) {
    return await Axios.post(ROUTINES_URL,
        {
            isAm: isAm,
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function deleteRoutine(id, token) {
    return await Axios.delete(`${ROUTINES_URL}/${id}`, {headers: { Authorization: `Bearer ${token}` }});
}

export async function patchRoutine(id, products, isAm, token) {
    return await Axios.patch(`${ROUTINES_URL}/${id}`, {
        isAm: isAm,
        productIds: products
    },{headers: { Authorization: `Bearer ${token}` }});
}

export async function removeProductsFromRoutine(id, products, isAm, token) {
    return await Axios.patch(`${REMOVE_FROM_ROUTINE_URL}${id}`,
        {
            isAm: isAm,
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function addProductsToRoutine(id, products, isAm, token) {
    return await Axios.patch(`${ADD_TO_ROUTINE_URL}${id}`,
        {
            isAm: isAm,
            productIds: products
        }, {headers: { Authorization: `Bearer ${token}` }});
}
