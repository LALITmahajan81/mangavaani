import axios from "axios";

// Use environment variables with fallbacks, pointing to the backend server
const API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.REACT_APP_API_URL || "http://localhost:5000/api/manga";

console.log("Using API URL:", API_URL);

// Base configuration for axios requests
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // Increased timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`Making request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        console.log(`Received response from: ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    async (error) => {
        // Handle errors globally
        console.error(`API Error: ${error.message}`);
        if (error.response) {
            console.log(`Status: ${error.response.status} - Data:`, error.response.data);
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const mangaAPI = {
    // Get manga list
    getMangaList: (params) => api.get("/", { params }),

    // Get manga details
    getMangaDetails: (id) => api.get(`/${id}`),

    // Get manga chapters
    getMangaChapters: (id) => api.get(`/${id}/chapters`),

    // Get chapter details
    getChapterImages: (chapterId) => api.get(`/chapter/${chapterId}`),

    // Search manga
    searchManga: (query, page = 1) => api.get(`/search/${encodeURIComponent(query)}`, { params: { page } }),
};

export default api;
