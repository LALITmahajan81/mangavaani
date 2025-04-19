import axios from "axios";

const api = axios.create({
    baseURL: "YOUR_API_BASE_URL",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        // You can add auth token here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors here
        return Promise.reject(error);
    }
);

export default api;
