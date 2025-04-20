import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import our screens
import MangaListScreen from "../pages/Manga/MangaListScreen";
import MangaDetailScreen from "../pages/Manga/MangaDetailScreen";
import ChapterListScreen from "../pages/Manga/ChapterListScreen";
import ReaderScreen from "../pages/Reader/ReaderScreen";

const Stack = createStackNavigator();

const MangaNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="MangaList"
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: "#121212",
                    borderBottomWidth: 1,
                    borderBottomColor: "#333333",
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="MangaList"
                component={MangaListScreen}
                options={{ title: "Manga List" }}
            />
            <Stack.Screen
                name="MangaDetail"
                component={MangaDetailScreen}
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
