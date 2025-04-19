// Initial state
const initialState = {
    popular: [],
    details: null,
    chapters: [],
    currentChapter: null,
    loading: false,
    error: null,
    searchResults: [],
    bookmarks: [],
    downloads: [],
};

// Action types
export const MANGA_TYPES = {
    FETCH_POPULAR_REQUEST: "FETCH_POPULAR_REQUEST",
    FETCH_POPULAR_SUCCESS: "FETCH_POPULAR_SUCCESS",
    FETCH_POPULAR_FAILURE: "FETCH_POPULAR_FAILURE",
    FETCH_DETAILS_REQUEST: "FETCH_DETAILS_REQUEST",
    FETCH_DETAILS_SUCCESS: "FETCH_DETAILS_SUCCESS",
    FETCH_DETAILS_FAILURE: "FETCH_DETAILS_FAILURE",
    FETCH_CHAPTERS_REQUEST: "FETCH_CHAPTERS_REQUEST",
    FETCH_CHAPTERS_SUCCESS: "FETCH_CHAPTERS_SUCCESS",
    FETCH_CHAPTERS_FAILURE: "FETCH_CHAPTERS_FAILURE",
    FETCH_CHAPTER_REQUEST: "FETCH_CHAPTER_REQUEST",
    FETCH_CHAPTER_SUCCESS: "FETCH_CHAPTER_SUCCESS",
    FETCH_CHAPTER_FAILURE: "FETCH_CHAPTER_FAILURE",
    SEARCH_REQUEST: "SEARCH_REQUEST",
    SEARCH_SUCCESS: "SEARCH_SUCCESS",
    SEARCH_FAILURE: "SEARCH_FAILURE",
    ADD_BOOKMARK: "ADD_BOOKMARK",
    REMOVE_BOOKMARK: "REMOVE_BOOKMARK",
    ADD_DOWNLOAD: "ADD_DOWNLOAD",
    REMOVE_DOWNLOAD: "REMOVE_DOWNLOAD",
};

// Reducer
const mangaReducer = (state = initialState, action) => {
    switch (action.type) {
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

        // Manga details
        case MANGA_TYPES.FETCH_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case MANGA_TYPES.FETCH_DETAILS_SUCCESS:
            return {
                ...state,
                details: action.payload,
                loading: false,
            };
        case MANGA_TYPES.FETCH_DETAILS_FAILURE:
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
                chapters: action.payload,
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
