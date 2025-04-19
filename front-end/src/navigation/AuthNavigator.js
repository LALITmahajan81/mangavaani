import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Auth Screens
import LoginScreen from "../pages/Auth/LoginScreen";
import RegisterScreen from "../pages/Auth/RegisterScreen";
import WelcomeScreen from "../pages/Auth/WelcomeScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "#FFFFFF" },
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
