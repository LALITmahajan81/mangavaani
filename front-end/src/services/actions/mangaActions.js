import { MANGA_TYPES } from "../constants/actionTypes";
// Import both MangaDex API and local backend API
import { mangaAPI, localMangaAPI } from "../api";
import { isMangaDexId, formatChapterImageUrl, formatMangaData, formatChapterData } from "../../utils/mangadexUtils";

// Use MangaDex API
const apiService = mangaAPI;

// Action Types
export const FETCH_MANGA_LIST_REQUEST = "FETCH_MANGA_LIST_REQUEST";
export const FETCH_MANGA_LIST_SUCCESS = "FETCH_MANGA_LIST_SUCCESS";
export const FETCH_MANGA_LIST_FAILURE = "FETCH_MANGA_LIST_FAILURE";

export const FETCH_MANGA_DETAILS_REQUEST = "FETCH_MANGA_DETAILS_REQUEST";
export const FETCH_MANGA_DETAILS_SUCCESS = "FETCH_MANGA_DETAILS_SUCCESS";
export const FETCH_MANGA_DETAILS_FAILURE = "FETCH_MANGA_DETAILS_FAILURE";

// Action Creators
export const fetchMangaList = (params) => async (dispatch) => {
    try {
        dispatch({ type: MANGA_TYPES.FETCH_MANGA_LIST_REQUEST });

        const response = await apiService.getMangaList(params);
        const responseData = response.data.data || [];

        // Transform MangaDex data to our format using utility function
        const mangaList = responseData.map((manga) => formatMangaData(manga));

        dispatch({
            type: MANGA_TYPES.FETCH_MANGA_LIST_SUCCESS,
            payload: mangaList,
        });
    } catch (error) {
        console.error("Error fetching manga list:", error);
        dispatch({
            type: MANGA_TYPES.FETCH_MANGA_LIST_FAILURE,
            payload: error.message || "Something went wrong",
        });
    }
};

// Fetch recently added manga
export const fetchRecentManga = () => async (dispatch) => {
    try {
        dispatch({ type: MANGA_TYPES.FETCH_RECENT_REQUEST });

        const response = await apiService.getMangaList({ type: "recent" });
        const responseData = response.data.data || [];

        // Transform MangaDex data to our format using utility function
        const recentManga = responseData.map((manga) => formatMangaData(manga));

        dispatch({
            type: MANGA_TYPES.FETCH_RECENT_SUCCESS,
            payload: recentManga,
        });
    } catch (error) {
        console.error("Error fetching recent manga:", error);
        dispatch({
            type: MANGA_TYPES.FETCH_RECENT_FAILURE,
            payload: error.message || "Failed to load recent manga",
        });
    }
};

export const fetchMangaDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: MANGA_TYPES.FETCH_MANGA_DETAILS_REQUEST });

        // Get manga details
        const response = await apiService.getMangaDetails(id);
        const manga = response.data.data;

        // Get manga statistics for view count
        const statsResponse = await apiService.getMangaStatistics(id);
        const stats = statsResponse.data.statistics[id];

        // Format manga data using our utility function
        const mangaData = formatMangaData(manga);

        // Add additional details from statistics
        mangaData.view = stats?.follows.toString() || "Unknown";

        // Find author and artist from relationships
        const relationships = manga.relationships || [];
        const author = relationships.find((rel) => rel.type === "author");
        const artist = relationships.find((rel) => rel.type === "artist");

        mangaData.author = author?.attributes?.name || "Unknown";
        mangaData.artist = artist?.attributes?.name || "Unknown";

        // Extract tags
        mangaData.tags = (manga.attributes.tags || []).map((tag) => tag.attributes?.name?.en || "").filter(Boolean);

        dispatch({
            type: MANGA_TYPES.FETCH_MANGA_DETAILS_SUCCESS,
            payload: mangaData,
        });
    } catch (error) {
        console.error("Error fetching manga details:", error);
        dispatch({
            type: MANGA_TYPES.FETCH_MANGA_DETAILS_FAILURE,
            payload: error.message || "Something went wrong",
        });
    }
};

// Legacy function for backward compatibility
export const fetchPopularManga = () => fetchMangaList({ type: "popular" });

// Get manga chapters
export const fetchMangaChapters = (id) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_CHAPTERS_REQUEST });

    try {
        const response = await apiService.getMangaChapters(id);
        const chaptersData = response.data.data || [];

        // Format chapters data using utility function
        const chapters = chaptersData.map((chapter) => formatChapterData(chapter));

        const responseData = {
            chapters: chapters,
            chapterCount: chapters.length,
        };

        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTERS_SUCCESS,
            payload: responseData,
        });
    } catch (error) {
        console.error("Error fetching chapters:", error);
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTERS_FAILURE,
            payload: error.message || "Failed to load chapters",
        });
    }
};

// Get chapter details
export const fetchChapterDetails = (mangaId, chapterId) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_CHAPTER_REQUEST });

    try {
        console.log(`Fetching chapter details for mangaId: ${mangaId}, chapterId: ${chapterId}`);

        const response = await apiService.getChapterImages(chapterId);
        const serverData = response.data;

        // MangaDex provides data and baseUrl for images
        const baseUrl = serverData.baseUrl;
        const chapter = serverData.chapter;

        // Construct full URLs for data (high quality) or dataSaver (low quality)
        let imageUrls = [];

        if (chapter.data && chapter.data.length > 0) {
            imageUrls = chapter.data.map((filename) => formatChapterImageUrl(baseUrl, chapter.hash, filename, false));
        }

        // If no images were found, use the data saver images
        if (imageUrls.length === 0 && chapter.dataSaver && chapter.dataSaver.length > 0) {
            imageUrls = chapter.dataSaver.map((filename) => formatChapterImageUrl(baseUrl, chapter.hash, filename, true));
        }

        // If still no images, create placeholders
        if (imageUrls.length === 0) {
            console.log("No images found from API, creating placeholders");
            // Create 10 placeholder images
            for (let i = 1; i <= 10; i++) {
                imageUrls.push(`https://placehold.co/800x1200?text=Page+${i}+Not+Available`);
            }
        }

        const chapterData = {
            images: imageUrls,
            pageCount: imageUrls.length,
            chapterId: chapterId,
            hash: chapter.hash || "placeholder-hash",
            baseUrl: baseUrl || "https://placeholders.com",
            source: "mangadex",
        };

        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: chapterData,
        });
    } catch (error) {
        console.error("Error fetching chapter details:", error);

        // Create fallback chapter data with placeholder images
        const fallbackImages = [];
        for (let i = 1; i <= 10; i++) {
            fallbackImages.push(`https://placehold.co/800x1200?text=Page+${i}+Fallback+Image`);
        }

        const fallbackData = {
            images: fallbackImages,
            pageCount: 10,
            chapterId: chapterId,
            hash: "fallback-hash",
            baseUrl: "https://fallback.com",
            source: "fallback",
        };

        // First dispatch the error
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_FAILURE,
            payload: error.message || "Failed to load chapter",
        });

        // Then dispatch the fallback data so UI can still show something
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: fallbackData,
        });
    }
};

// Simpler function to get chapter details with fewer API calls
export const fetchChapterImagesSimple = (mangaId, chapterId) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_CHAPTER_REQUEST });

    try {
        console.log(`Fetching chapter images (simple method) for mangaId: ${mangaId}, chapterId: ${chapterId}`);

        // Use the simplified method instead
        const response = await apiService.getChapterImagesSimple(chapterId);
        const serverData = response.data;

        // If the API returned direct image URLs, use those
        let imageUrls = serverData.images || [];

        // If no direct URLs but we have chapter data, construct them
        if (imageUrls.length === 0 && serverData.chapter) {
            const chapter = serverData.chapter;
            const baseUrl = serverData.baseUrl || "https://uploads.mangadex.org";

            if (chapter.data && chapter.data.length > 0) {
                imageUrls = chapter.data.map((filename) => `${baseUrl}/data/${chapter.hash}/${filename}`);
            }
        }

        // If still no images, create placeholders
        if (imageUrls.length === 0) {
            console.log("No images found, creating placeholders");
            // Create 10 placeholder images
            for (let i = 1; i <= 10; i++) {
                imageUrls.push(`https://placehold.co/800x1200?text=Page+${i}+Not+Available`);
            }
        }

        const chapterData = {
            images: imageUrls,
            pageCount: imageUrls.length,
            chapterId: chapterId,
            source: "mangadex-simple",
        };

        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: chapterData,
        });
    } catch (error) {
        console.error("Error fetching chapter images:", error);

        // Create fallback chapter data with placeholder images
        const fallbackImages = [];
        for (let i = 1; i <= 10; i++) {
            fallbackImages.push(`https://placehold.co/800x1200?text=Page+${i}+Fallback+Image`);
        }

        const fallbackData = {
            images: fallbackImages,
            pageCount: 10,
            chapterId: chapterId,
            source: "fallback-simple",
        };

        // Log the error but still provide fallback data
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_FAILURE,
            payload: error.message || "Failed to load chapter",
        });

        // Then dispatch the fallback data so UI can still show something
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: fallbackData,
        });
    }
};

// Search manga
export const searchManga = (query) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.SEARCH_REQUEST });

    try {
        const response = await apiService.searchManga(query);
        const responseData = response.data.data || [];

        // Transform MangaDex data to our format using utility function
        const results = responseData.map((manga) => formatMangaData(manga));

        dispatch({
            type: MANGA_TYPES.SEARCH_SUCCESS,
            payload: results,
        });
    } catch (error) {
        console.error("Error searching manga:", error);
        dispatch({
            type: MANGA_TYPES.SEARCH_FAILURE,
            payload: error.message || "Search failed",
        });
    }
};

// Add bookmark
export const addBookmark = (manga) => ({
    type: MANGA_TYPES.ADD_BOOKMARK,
    payload: manga,
});

// Remove bookmark
export const removeBookmark = (id) => ({
    type: MANGA_TYPES.REMOVE_BOOKMARK,
    payload: id,
});

// Add download
export const addDownload = (manga) => ({
    type: MANGA_TYPES.ADD_DOWNLOAD,
    payload: manga,
});

// Remove download
export const removeDownload = (id) => ({
    type: MANGA_TYPES.REMOVE_DOWNLOAD,
    payload: id,
});
