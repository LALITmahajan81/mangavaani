import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// Tab Screens
import HomeScreen from "../pages/Home/HomeScreen";
import LibraryScreen from "../pages/Home/LibraryScreen";
import SearchScreen from "../pages/Home/SearchScreen";
import SettingsScreen from "../pages/Home/SettingsScreen";

// Stack Navigators
import MangaNavigator from "./MangaNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const theme = useSelector((state) => state.settings.theme);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Library") {
                        iconName = focused ? "library" : "library-outline";
                    } else if (route.name === "Search") {
                        iconName = focused ? "search" : "search-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: "#6C63FF",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                    borderTopColor: theme === "dark" ? "#333333" : "#E0E0E0",
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />
            <Tab.Screen
                name="Library"
                component={LibraryScreen}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;
