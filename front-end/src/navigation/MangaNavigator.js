import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Manga Screens
import MangaDetailsScreen from "../pages/Manga/MangaDetailsScreen";
import ChapterListScreen from "../pages/Manga/ChapterListScreen";
import ReaderScreen from "../pages/Reader/ReaderScreen";

const Stack = createStackNavigator();

const MangaNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="MangaDetails"
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: "#007AFF",
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="MangaDetails"
                component={MangaDetailsScreen}
                options={({ route }) => ({ title: route.params?.title || "Manga Details" })}
            />
            <Stack.Screen
                name="ChapterList"
                component={ChapterListScreen}
                options={({ route }) => ({ title: route.params?.title || "Chapters" })}
            />
            <Stack.Screen
                name="Reader"
                component={ReaderScreen}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default MangaNavigator;
