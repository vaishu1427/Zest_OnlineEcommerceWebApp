import axios from "axios";
import {baseUrl} from "./config";

export async function createProduct(token,body){
    return await axios.post(`${baseUrl}/seller/products`,{
        "name":body.name,
        "description":body.description,
        "price":body.price,
        "quantity":body.quantity,
        "brand":body.brand,
        "colour":body.colour,
        "image":body.image,
        "sellerId":body.sellerId,
        "category":body.category
    },{
        headers: { "Content-Type":'multipart/form-data', Authorization: `Bearer ${token}`}
    })
}


export async function getProduct(token){
    return await axios.get(`${baseUrl}/products`,{
        headers: { Authorization: `Bearer ${token}` }
    })
}