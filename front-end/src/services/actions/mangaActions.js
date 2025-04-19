import { MANGA_TYPES } from "../reducers/mangaReducer";
import { mangaAPI } from "../api";

// Get popular manga
export const fetchPopularManga = () => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_POPULAR_REQUEST });

    try {
        const response = await mangaAPI.getPopularManga();
        dispatch({
            type: MANGA_TYPES.FETCH_POPULAR_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: MANGA_TYPES.FETCH_POPULAR_FAILURE,
            payload: error.message,
        });
    }
};

// Get manga details
export const fetchMangaDetails = (id) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_DETAILS_REQUEST });

    try {
        const response = await mangaAPI.getMangaDetails(id);
        dispatch({
            type: MANGA_TYPES.FETCH_DETAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: MANGA_TYPES.FETCH_DETAILS_FAILURE,
            payload: error.message,
        });
    }
};

// Get manga chapters
export const fetchMangaChapters = (id) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_CHAPTERS_REQUEST });

    try {
        const response = await mangaAPI.getMangaChapters(id);
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTERS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTERS_FAILURE,
            payload: error.message,
        });
    }
};

// Get chapter details
export const fetchChapterDetails = (mangaId, chapterId) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.FETCH_CHAPTER_REQUEST });

    try {
        const response = await mangaAPI.getChapterDetails(mangaId, chapterId);
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: MANGA_TYPES.FETCH_CHAPTER_FAILURE,
            payload: error.message,
        });
    }
};

// Search manga
export const searchManga = (query) => async (dispatch) => {
    dispatch({ type: MANGA_TYPES.SEARCH_REQUEST });

    try {
        const response = await mangaAPI.searchManga(query);
        dispatch({
            type: MANGA_TYPES.SEARCH_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: MANGA_TYPES.SEARCH_FAILURE,
            payload: error.message,
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
