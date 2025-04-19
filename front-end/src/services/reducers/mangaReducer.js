import { MANGA_TYPES } from "../constants/actionTypes";

// Initial state
const initialState = {
    mangaList: [],
    currentManga: null,
    loading: false,
    error: null,
    popular: [],
    recentManga: [],
    recentLoading: false,
    recentError: null,
    details: null,
    chapters: [],
    chapterCount: 0,
    currentChapter: null,
    searchResults: [],
    bookmarks: [],
    downloads: [],
};

// Reducer
const mangaReducer = (state = initialState, action) => {
    switch (action.type) {
        // Manga List actions
        case MANGA_TYPES.FETCH_MANGA_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case MANGA_TYPES.FETCH_MANGA_LIST_SUCCESS:
            return {
                ...state,
                mangaList: action.payload,
                loading: false,
            };

        case MANGA_TYPES.FETCH_MANGA_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Recently Added Manga actions
        case MANGA_TYPES.FETCH_RECENT_REQUEST:
            return {
                ...state,
                recentLoading: true,
                recentError: null,
            };

        case MANGA_TYPES.FETCH_RECENT_SUCCESS:
            return {
                ...state,
                recentManga: action.payload,
                recentLoading: false,
            };

        case MANGA_TYPES.FETCH_RECENT_FAILURE:
            return {
                ...state,
                recentLoading: false,
                recentError: action.payload,
            };

        // Manga Details actions
        case MANGA_TYPES.FETCH_MANGA_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case MANGA_TYPES.FETCH_MANGA_DETAILS_SUCCESS:
            return {
                ...state,
                currentManga: action.payload,
                loading: false,
            };

        case MANGA_TYPES.FETCH_MANGA_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Popular manga
        case MANGA_TYPES.FETCH_POPULAR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case MANGA_TYPES.FETCH_POPULAR_SUCCESS:
            return {
                ...state,
                popular: action.payload,
                loading: false,
            };
        case MANGA_TYPES.FETCH_POPULAR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Manga chapters
        case MANGA_TYPES.FETCH_CHAPTERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case MANGA_TYPES.FETCH_CHAPTERS_SUCCESS:
            return {
                ...state,
                chapters: action.payload.chapters || action.payload,
                chapterCount: action.payload.chapterCount || (action.payload.chapters ? action.payload.chapters.length : 0),
                loading: false,
            };
        case MANGA_TYPES.FETCH_CHAPTERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Chapter details
        case MANGA_TYPES.FETCH_CHAPTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case MANGA_TYPES.FETCH_CHAPTER_SUCCESS:
            return {
                ...state,
                currentChapter: action.payload,
                loading: false,
            };
        case MANGA_TYPES.FETCH_CHAPTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Search
        case MANGA_TYPES.SEARCH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case MANGA_TYPES.SEARCH_SUCCESS:
            return {
                ...state,
                searchResults: action.payload,
                loading: false,
            };
        case MANGA_TYPES.SEARCH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Bookmarks
        case MANGA_TYPES.ADD_BOOKMARK:
            return {
                ...state,
                bookmarks: [...state.bookmarks, action.payload],
            };
        case MANGA_TYPES.REMOVE_BOOKMARK:
            return {
                ...state,
                bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== action.payload),
            };

        // Downloads
        case MANGA_TYPES.ADD_DOWNLOAD:
            return {
                ...state,
                downloads: [...state.downloads, action.payload],
            };
        case MANGA_TYPES.REMOVE_DOWNLOAD:
            return {
                ...state,
                downloads: state.downloads.filter((download) => download.id !== action.payload),
            };

        default:
            return state;
    }
};

export default mangaReducer;
