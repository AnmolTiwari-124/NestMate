
import axios from "axios";

const API = axios.create({
 baseURL: "https://nestmate-backend-qso7.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:session-expired"));
    }

    return Promise.reject(error);
  }
);

export default API;
