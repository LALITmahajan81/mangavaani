import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

// Tab Screens
import HomeScreen from "../pages/Home/HomeScreen";
import LibraryScreen from "../pages/Home/LibraryScreen";
import SearchScreen from "../pages/Home/SearchScreen";
import SettingsScreen from "../pages/Home/SettingsScreen";

// Stack Navigators
import MangaNavigator from "./MangaNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <View style={styles.container}>
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
                    tabBarActiveTintColor: "#4a9eff",
                    tabBarInactiveTintColor: "#999999",
                    tabBarStyle: {
                        backgroundColor: "#121212",
                        borderTopColor: "#2a2a2a",
                        borderTopWidth: 1,
                        elevation: 8,
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        height: 60,
                        paddingBottom: 6,
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
                <Tab.Screen
                    name="MangaStack"
                    component={MangaNavigator}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: "none" },
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
});

export default AppNavigator;
