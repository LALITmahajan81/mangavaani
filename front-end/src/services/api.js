import axios from "axios";

// Base configuration for axios requests
const api = axios.create({
    baseURL: "https://api.mangavaani.com", // This would be your actual API base URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        // You could add authorization headers here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle errors globally
        return Promise.reject(error);
    }
);

// API endpoints
export const mangaAPI = {
    // Get popular manga
    getPopularManga: () => api.get("/manga/popular"),

    // Get manga details
    getMangaDetails: (id) => api.get(`/manga/${id}`),

    // Get manga chapters
    getMangaChapters: (id) => api.get(`/manga/${id}/chapters`),

    // Get chapter details
    getChapterDetails: (mangaId, chapterId) => api.get(`/manga/${mangaId}/chapters/${chapterId}`),

    // Search manga
    searchManga: (query) => api.get(`/manga/search?q=${query}`),

    // Get manga by genre
    getMangaByGenre: (genre) => api.get(`/manga/genre/${genre}`),
};

export default api;
