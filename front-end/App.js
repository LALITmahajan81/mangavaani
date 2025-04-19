import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
    const [showHome, setShowHome] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life"];

    const StartPage = () => (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>MangaVaani</Text>
                <Text style={styles.subtitle}>Your Ultimate Manga Reading Experience</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About MangaVaani</Text>
                <Text style={styles.infoText}>
                    MangaVaani brings you a vast collection of manga from various sources. Our app uses advanced web scraping to provide you with the
                    latest chapters and series updates. Discover, read, and enjoy your favorite manga all in one place!
                </Text>
            </View>

            <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Select Your Favorite Categories</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.categoryButton, selectedCategories.includes(category) && styles.selectedCategory]}
                            onPress={() => {
                                if (selectedCategories.includes(category)) {
                                    setSelectedCategories(selectedCategories.filter((c) => c !== category));
                                } else {
                                    setSelectedCategories([...selectedCategories, category]);
                                }
                            }}
                        >
                            <Text style={[styles.categoryText, selectedCategories.includes(category) && styles.selectedCategoryText]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => setShowHome(true)}
            >
                <Text style={styles.startButtonText}>Get Started</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    return (
        <>
            <StatusBar style="auto" />
            {showHome ? <HomeScreen selectedCategories={selectedCategories} /> : <StartPage />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#6200ee",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "white",
        opacity: 0.8,
    },
    infoSection: {
        padding: 20,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    infoText: {
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
    },
    categoriesSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    categoryButton: {
        width: "48%",
        padding: 15,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    selectedCategory: {
        backgroundColor: "#6200ee",
    },
    categoryText: {
        fontSize: 16,
        color: "#333",
    },
    selectedCategoryText: {
        color: "white",
    },
    startButton: {
        backgroundColor: "#6200ee",
        padding: 15,
        margin: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    startButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
