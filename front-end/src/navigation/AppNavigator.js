import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

// Import screens (to be created)
import HomeScreen from "../screens/HomeScreen";
import AuthScreen from "../screens/auth/AuthScreen";
import ReaderScreen from "../screens/reader/ReaderScreen";
import LibraryScreen from "../screens/library/LibraryScreen";
import DiscoverScreen from "../screens/discover/DiscoverScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
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
                        } else if (route.name === "Profile") {
                            iconName = focused ? "person" : "person-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.text + "80",
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                        borderTopColor: theme.colors.primary,
                        paddingBottom: 5,
                        paddingTop: 5,
                    },
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
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
                    name="Profile"
                    component={ProfileScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
