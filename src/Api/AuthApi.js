import axios from "axios";

const API_URL = "https://ecom-1-um8s.onrender.com/api/products";


// =========================
// LOGIN
// =========================

export const loginUser = async (email, password) => {

    const response = await axios.post(
        `${API_URL}/login`,
        {
            email,
            password
        }
    );

    return response.data;
};


// =========================
// REGISTER
// =========================

export const registerUser = async (
    name,
    email,
    password
) => {

    const response = await axios.post(
        `${API_URL}/register`,
        {
            name,
            email,
            password
        }
    );

    return response.data;
};