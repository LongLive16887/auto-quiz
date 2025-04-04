import axios from "axios";
import { useUserStore } from '../store/user'


const api = axios.create({
  baseURL: "https://backend.avtotest-begzod.uz/",
  headers: { "Content-Type": "application/json" },
});
//https://backend.avtotest-begzod.uz/avtotest/
api.interceptors.request.use(config => {
  const token = useUserStore.getState().token
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setTimeout(() => {
        const logoutUser = useUserStore.getState().lougoutUser; 
        logoutUser(); 
        window.location.href = "/login"; 
      }, 0);
    }

    return Promise.reject(error);
  }
);

export default api;
