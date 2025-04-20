import axios from "axios";

// Define multiple possible API URLs (try different connection methods)
const API_URLS = [
    "http://10.10.115.83:5001/api", // Your local network IP - try first
    "http://localhost:5001/api", // Local connection
    "http://10.0.2.2:5001/api", // Android emulator localhost
    "http://127.0.0.1:5001/api", // Alternative localhost
];

// Start with the first URL
let currentUrlIndex = 0;
let API_URL = API_URLS[currentUrlIndex];

console.log("Starting with API URL:", API_URL);

// Function to try the next API URL
const tryNextApiUrl = () => {
    currentUrlIndex = (currentUrlIndex + 1) % API_URLS.length;
    API_URL = API_URLS[currentUrlIndex];
    api.defaults.baseURL = API_URL;
    console.log("Switching to next API URL:", API_URL);
    return API_URL;
};

// Base configuration for axios requests
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        // Create full URL for debugging
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`Making request to: ${fullUrl}`);

        // For POST requests, log the data being sent
        if (config.method === "post" && config.data) {
            console.log("Request data:", JSON.stringify(config.data));
        }

        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Maximum number of retry attempts
const MAX_RETRIES = 2;

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        console.log(`Received response from: ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If we haven't set the retry count yet, initialize it
        if (originalRequest && !originalRequest._retryCount) {
            originalRequest._retryCount = 0;
        }

        // Handle network errors with retries
        if (error.message.includes("Network Error") && originalRequest && originalRequest._retryCount < MAX_RETRIES) {
            originalRequest._retryCount++;

            console.log(`Retry attempt ${originalRequest._retryCount} for ${originalRequest.url}`);

            // Try a different API URL
            const newUrl = tryNextApiUrl();

            // Update the baseURL in the original request
            originalRequest.baseURL = newUrl;

            // Small delay before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Retry the request with the new base URL
            return api(originalRequest);
        }

        // Handle errors globally
        console.error(`API Error: ${error.message}`);
        if (error.response) {
            console.log(`Status: ${error.response.status} - Data:`, error.response.data);
        } else {
            console.error("Network Error Details:", error);
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const mangaAPI = {
    // Get manga list
    getMangaList: (params) => api.get("/manga", { params }),

    // Get manga details
    getMangaDetails: (id) => api.get(`/manga/${id}`),

    // Get manga chapters
    getMangaChapters: (id) => api.get(`/manga/${id}/chapters`),

    // Get chapter details
    getChapterImages: (chapterId) => api.get(`/manga/chapter/${chapterId}`),

    // Search manga
    searchManga: (query, page = 1) => api.get(`/manga/search/${encodeURIComponent(query)}`, { params: { page } }),

    // Test connection
    testConnection: () => api.get("/manga/status"),

    // Get current API URL
    getCurrentApiUrl: () => API_URL,

    // Try next API URL
    tryNextApiUrl: tryNextApiUrl,
};

// Authentication API endpoints
export const authAPI = {
    // Register new user
    register: (userData) => api.post("/auth/register", userData),

    // Login user
    login: (credentials) => api.post("/auth/login", credentials),

    // Get user profile
    getProfile: (token) =>
        api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        }),

    // Simple test endpoint to check connectivity
    testEndpoint: () => api.get("/auth/test"),
};

export default api;
