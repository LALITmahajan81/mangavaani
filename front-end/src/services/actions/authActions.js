import { AUTH_TYPES } from "../reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../api";

// Login user
export const login = (email, password) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.LOGIN_REQUEST });

    try {
        // Make API call to login endpoint
        const response = await authAPI.login({ email, password });

        // Get user data and token from response
        const { token, user } = response.data;

        // Save token and user data to AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        dispatch({
            type: AUTH_TYPES.LOGIN_SUCCESS,
            payload: user,
        });
    } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Login failed";

        dispatch({
            type: AUTH_TYPES.LOGIN_FAILURE,
            payload: errorMessage,
        });
    }
};

// Register user
export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.REGISTER_REQUEST });

    try {
        // Make API call to register endpoint
        const response = await authAPI.register({ name, email, password });

        // Get user data and token from response
        const { token, user } = response.data;

        // Save token and user data to AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        dispatch({
            type: AUTH_TYPES.REGISTER_SUCCESS,
            payload: user,
        });
    } catch (error) {
        console.error("Registration error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Registration failed";

        dispatch({
            type: AUTH_TYPES.REGISTER_FAILURE,
            payload: errorMessage,
        });
    }
};

// Logout user
export const logout = () => async (dispatch) => {
    // Remove token and user data from AsyncStorage
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    dispatch({ type: AUTH_TYPES.LOGOUT });
};

// Check if user is already logged in
export const checkAuth = () => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.LOGIN_REQUEST });

    try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
            // Validate token by fetching user profile
            try {
                const response = await authAPI.getProfile(token);
                // If successful, update user data
                dispatch({
                    type: AUTH_TYPES.LOGIN_SUCCESS,
                    payload: response.data.user,
                });
                // Update stored user data with fresh data
                await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            } catch (error) {
                console.log("Token validation failed, logging out");
                // If token is invalid, logout
                dispatch(logout());
            }
        } else {
            dispatch({ type: AUTH_TYPES.LOGOUT });
        }
    } catch (error) {
        console.error("Auth check error:", error);
        dispatch({
            type: AUTH_TYPES.LOGIN_FAILURE,
            payload: error.message,
        });
    }
};

// Test auth connection
export const testAuthConnection = () => async (dispatch) => {
    try {
        // Try the test endpoint
        const response = await authAPI.testEndpoint();
        console.log("Auth test successful:", response.data);
        return true;
    } catch (error) {
        console.error("Auth test failed:", error);
        return false;
    }
};
