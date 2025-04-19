import React, { useEffect } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

// Navigators
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

// Actions
import { checkAuth } from "../services/actions/authActions";
import { loadSettings } from "../services/actions/settingsActions";

// Custom Dark Theme
const MyDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: "#121212",
        card: "#121212",
        text: "#FFFFFF",
        border: "#333333",
        primary: "#4a9eff",
    },
};

const RootNavigator = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is logged in
        dispatch(checkAuth());

        // Load user settings
        dispatch(loadSettings());
    }, [dispatch]);

    // If still checking auth state, you could show a loading indicator
    if (loading) {
        return null; // Expo will show the splash screen during this time
    }

    return <NavigationContainer theme={MyDarkTheme}>{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
};

export default RootNavigator;
