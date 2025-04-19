import { MANGA_TYPES } from "../constants/actionTypes";
import { mangaAPI } from "../api";

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

        const response = await mangaAPI.getMangaList(params);
        const mangaList = response.data.mangaList || [];

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

        const response = await mangaAPI.getMangaList({ type: "recent" });
        const recentManga = response.data.mangaList || [];

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

        const response = await mangaAPI.getMangaDetails(id);

        dispatch({
            type: MANGA_TYPES.FETCH_MANGA_DETAILS_SUCCESS,
            payload: response.data,
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
        const response = await mangaAPI.getMangaChapters(id);
        const chapters = response.data.chapters || [];

        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTERS_SUCCESS,
            payload: chapters,
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
        const response = await mangaAPI.getChapterImages(chapterId);
        const chapterData = response.data;

        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: chapterData,
        });
    } catch (error) {
        console.error("Error fetching chapter details:", error);
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_FAILURE,
            payload: error.message || "Failed to load chapter",
        });
    }
};

// Search manga
export const searchManga = (query) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.SEARCH_REQUEST });

    try {
        const response = await mangaAPI.searchManga(query);
        const results = response.data.results || [];

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
