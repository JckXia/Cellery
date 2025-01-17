import Axios from "../axios";
import {PRODUCTS_URL, PRODUCTS_BATCH_DELETE} from "react-native-dotenv";

export async function userProducts(token) {
    return await Axios.get(PRODUCTS_URL, {headers: { Authorization: `Bearer ${token}` }});
}

export async function getProduct(id, token) {
    return await Axios.get(`${PRODUCTS_URL}/${id}`, {headers: { Authorization: `Bearer ${token}` }});
}

export async function createProduct(name, desc, token) {
    return await Axios.post(PRODUCTS_URL, {
        name: name,
        description: desc
    }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function editProduct(id, name, desc, token) {
    return await Axios.patch(`${PRODUCTS_URL}/${id}`, {
        name: name,
        description: desc
    }, {headers: { Authorization: `Bearer ${token}` }});
}

export async function deleteProduct(id, token) {
    return await Axios.delete(`${PRODUCTS_URL}/${id}`, {headers: { Authorization: `Bearer ${token}` }});
}

// productIds is an array of strings
export async function deleteMultipleProducts(productIds, token) {
    return await Axios.delete(`${PRODUCTS_URL}${PRODUCTS_BATCH_DELETE}`, {data: productIds, headers: { Authorization: `Bearer ${token}` }});
}