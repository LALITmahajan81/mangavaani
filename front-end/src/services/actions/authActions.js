import { AUTH_TYPES } from "../reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock user for demo purposes
const mockUser = {
    id: "1234",
    name: "John Doe",
    email: "john@example.com",
};

// Login user
export const login = (email, password) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.LOGIN_REQUEST });

    try {
        // In a real app, you would make an API call here
        // const response = await api.post('/auth/login', { email, password });

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = mockUser;

        // Save user data to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        dispatch({
            type: AUTH_TYPES.LOGIN_SUCCESS,
            payload: userData,
        });
    } catch (error) {
        dispatch({
            type: AUTH_TYPES.LOGIN_FAILURE,
            payload: error.message || "Login failed",
        });
    }
};

// Register user
export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.REGISTER_REQUEST });

    try {
        // In a real app, you would make an API call here
        // const response = await api.post('/auth/register', { name, email, password });

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const userData = { ...mockUser, name };

        // Save user data to AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        dispatch({
            type: AUTH_TYPES.REGISTER_SUCCESS,
            payload: userData,
        });
    } catch (error) {
        dispatch({
            type: AUTH_TYPES.REGISTER_FAILURE,
            payload: error.message || "Registration failed",
        });
    }
};

// Logout user
export const logout = () => async (dispatch) => {
    // Remove user data from AsyncStorage
    await AsyncStorage.removeItem("user");

    dispatch({ type: AUTH_TYPES.LOGOUT });
};

// Check if user is already logged in
export const checkAuth = () => async (dispatch) => {
    dispatch({ type: AUTH_TYPES.LOGIN_REQUEST });

    try {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
            dispatch({
                type: AUTH_TYPES.LOGIN_SUCCESS,
                payload: JSON.parse(userData),
            });
        } else {
            dispatch({ type: AUTH_TYPES.LOGOUT });
        }
    } catch (error) {
        dispatch({
            type: AUTH_TYPES.LOGIN_FAILURE,
            payload: error.message,
        });
    }
};
