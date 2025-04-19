import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import our screens
import MangaListScreen from "../pages/Manga/MangaListScreen";
import MangaDetailScreen from "../pages/Manga/MangaDetailScreen";
import ChapterReader from "../components/ChapterReader";
import CommentSection from "../components/CommentSection";

const Stack = createStackNavigator();

const CommentsScreen = ({ route }) => {
    const { mangaId, mangaTitle } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <CommentSection />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

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
                name="ChapterReader"
                component={ChapterReader}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="Comments"
                component={CommentsScreen}
                options={({ route }) => ({ title: `${route.params?.mangaTitle || "Manga"} Comments` })}
            />
        </Stack.Navigator>
    );
};

export default MangaNavigator;
