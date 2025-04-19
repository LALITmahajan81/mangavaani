import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import { theme } from "./styles/theme";

export default function App() {
    const [showHome, setShowHome] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life"];

    const StartPage = () => (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: theme.colors.background }}
        >
            <View
                className="p-5 items-center"
                style={{ backgroundColor: theme.colors.primary }}
            >
                <Text
                    className="text-3xl font-bold mb-2"
                    style={{ color: theme.colors.text }}
                >
                    MangaVaani
                </Text>
                <Text
                    className="text-base opacity-80"
                    style={{ color: theme.colors.text }}
                >
                    Your Ultimate Manga Reading Experience
                </Text>
            </View>

            <View
                className="p-5 m-5 rounded-xl"
                style={{ backgroundColor: theme.colors.primaryLight }}
            >
                <Text
                    className="text-xl font-bold mb-2"
                    style={{ color: theme.colors.text }}
                >
                    About MangaVaani
                </Text>
                <Text
                    className="text-base leading-6"
                    style={{ color: theme.colors.text }}
                >
                    MangaVaani brings you a vast collection of manga from various sources. Our app uses advanced web scraping to provide you with the
                    latest chapters and series updates. Discover, read, and enjoy your favorite manga all in one place!
                </Text>
            </View>

            <View className="p-5">
                <Text
                    className="text-xl font-bold mb-4"
                    style={{ color: theme.colors.text }}
                >
                    Select Your Favorite Categories
                </Text>
                <View className="flex-row flex-wrap justify-between">
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`w-[48%] p-4 mb-3 rounded-lg items-center`}
                            style={{
                                backgroundColor: selectedCategories.includes(category) ? theme.colors.primary : theme.colors.primaryLight,
                            }}
                            onPress={() => {
                                if (selectedCategories.includes(category)) {
                                    setSelectedCategories(selectedCategories.filter((c) => c !== category));
                                } else {
                                    setSelectedCategories([...selectedCategories, category]);
                                }
                            }}
                        >
                            <Text style={{ color: theme.colors.text }}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                className="p-4 mx-5 mb-5 rounded-lg items-center"
                style={{ backgroundColor: theme.colors.primary }}
                onPress={async () => {
                    try {
                        await AsyncStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));
                        setShowLogin(true);
                    } catch (error) {
                        console.error("Error saving categories:", error);
                    }
                }}
            >
                <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "bold" }}>Get Started</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    if (showLogin) {
        return (
            <LoginScreen
                onClose={() => setShowLogin(false)}
                onLogin={() => setShowHome(true)}
            />
        );
    }

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: theme.colors.background }}
        >
            <StatusBar style="light" />
            {showHome ? <AppNavigator /> : <StartPage />}
        </SafeAreaView>
    );
}
