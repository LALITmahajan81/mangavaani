// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Action types
export const AUTH_TYPES = {
    LOGIN_REQUEST: "LOGIN_REQUEST",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILURE: "LOGIN_FAILURE",
    REGISTER_REQUEST: "REGISTER_REQUEST",
    REGISTER_SUCCESS: "REGISTER_SUCCESS",
    REGISTER_FAILURE: "REGISTER_FAILURE",
    LOGOUT: "LOGOUT",
};

// Reducer
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        // Login
        case AUTH_TYPES.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AUTH_TYPES.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
            };
        case AUTH_TYPES.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Register
        case AUTH_TYPES.REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AUTH_TYPES.REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
            };
        case AUTH_TYPES.REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Logout
        case AUTH_TYPES.LOGOUT:
            return {
                ...initialState,
            };

        default:
            return state;
    }
};

export default authReducer;
