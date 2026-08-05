import axios from "axios";                        

const API = axios.create({
    baseURL: "https://slotify-application-backend.onrender.com"                     
});

//Automatically set the headers at the time of making req from frontend to backend

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})


export const toggleFavorite = async (parkingId) => {
  const response = await API.post("/api/favorites/toggle", { parkingId });
  return response.data;
};

export const getUserFavorites = async () => {
  const response = await API.get("/api/favorites");
  return response.data;
};

export default API;