import axios from "axios";                       //axios = helps react talk with backend

const API = axios.create({
    baseURL: "http://localhost:3000"                     //json server address
});

export default API;