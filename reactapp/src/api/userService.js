import { baseUrl } from "./config";
import axios from "axios";


export async function createUserService(firstName, lastName, email, password, phone, roles, gender) {
    console.log(email)
    return await axios.post(`${baseUrl}/auth/register`, {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "phone": phone,
        "roles": roles,
        "gender": gender
    })
}

export async function loginUserService(email, password) {
    return await axios.post(`${baseUrl}/auth/login`, {
        "email": email,
        "password": password
    })
}

export async function validateTokenService(token) {
    return await axios.get(`${baseUrl}/auth/validateToken`, {
        headers: { "Authorization": token }
    })
}
export async function getAllUser(token) {
    return await axios.get(`${baseUrl}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export async function updateUserById(token, id, updatedUser) {
    return await axios.put(`${baseUrl}/auth/user/${id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function disabledUserById(token, id) {
    return await axios.put(`${baseUrl}/auth/user/${id}/disable`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function sendVerificationSecurityCodeForFP(email) {
    return await axios.post(`${baseUrl}/auth/forgot-password/send-verification-email?email=${email}`,)
}

export async function verifySecurityCodeForFP(email, securityCode) {
    return await axios.post(`${baseUrl}/auth/verify-security-code?email=${email}&otp=${securityCode}`,)
}

export async function updatePasswordForFP(password, email) {
    return await axios.put(`${baseUrl}/auth/forgot-password?email=${email}&password=${password}`)
}

