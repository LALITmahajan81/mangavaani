import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

// Components
import MangaCard from "../../components/common/MangaCard";

// Actions
import { fetchPopularManga } from "../../services/actions/mangaActions";

// Mock data for the UI
const mockContinueReading = [
    {
        id: "1",
        title: "One Piece",
        coverImage: "https://via.placeholder.com/150x200",
        currentChapter: "Chapter 1052",
        progress: 0.75,
    },
    {
        id: "2",
        title: "Demon Slayer",
        coverImage: "https://via.placeholder.com/150x200",
        currentChapter: "Chapter 205",
        progress: 0.2,
    },
];

const mockRecentlyAdded = [
    {
        id: "3",
        title: "My Hero Academia",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Kohei Horikoshi",
        rating: "4.8",
    },
    {
        id: "4",
        title: "Jujutsu Kaisen",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Gege Akutami",
        rating: "4.7",
    },
    {
        id: "5",
        title: "Chainsaw Man",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Tatsuki Fujimoto",
        rating: "4.9",
    },
];

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { popular, loading, error } = useSelector((state) => state.manga);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchPopularManga());
    }, [dispatch]);

    const renderContinueReadingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.continueReadingItem}
            onPress={() =>
                navigation.navigate("MangaStack", {
                    screen: "MangaDetails",
                    params: { id: item.id, title: item.title },
                })
            }
        >
            <MangaCard
                manga={item}
                size="small"
            />
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
            </View>
            <Text style={styles.chapterText}>{item.currentChapter}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name || "Reader"}!</Text>
                        <Text style={styles.subGreeting}>What would you like to read today?</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons
                            name="person-circle"
                            size={40}
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Continue Reading */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Continue Reading</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={mockContinueReading}
                        renderItem={renderContinueReadingItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.continueReadingList}
                    />
                </View>

                {/* Popular Manga */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Manga</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.mangaRow}>
                            {(popular.length > 0 ? popular : mockRecentlyAdded).map((manga) => (
                                <MangaCard
                                    key={manga.id}
                                    manga={manga}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Recently Added */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Added</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.mangaRow}>
                            {mockRecentlyAdded.map((manga) => (
                                <MangaCard
                                    key={manga.id}
                                    manga={manga}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subGreeting: {
        fontSize: 16,
        color: "#BDBDBD",
        marginTop: 4,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    seeAllText: {
        fontSize: 14,
        color: "#007AFF",
    },
    continueReadingList: {
        paddingRight: 16,
    },
    continueReadingItem: {
        marginRight: 16,
        width: 150,
    },
    progressContainer: {
        height: 4,
        backgroundColor: "#333333",
        borderRadius: 2,
        marginTop: 8,
        marginBottom: 4,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#007AFF",
        borderRadius: 2,
    },
    chapterText: {
        fontSize: 12,
        color: "#BDBDBD",
    },
    mangaRow: {
        flexDirection: "row",
    },
});

export default HomeScreen;
