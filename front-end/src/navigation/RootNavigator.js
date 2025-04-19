import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

// Navigators
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

// Actions
import { checkAuth } from "../services/actions/authActions";
import { loadSettings } from "../services/actions/settingsActions";

const RootNavigator = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is logged in
        dispatch(checkAuth());

        // Load user settings
        dispatch(loadSettings());
    }, [dispatch]);

    // If still checking auth state, you could show a splash screen here
    if (loading) {
        return null; // Or return a splash screen
    }

    return <NavigationContainer>{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
};

export default RootNavigator;
