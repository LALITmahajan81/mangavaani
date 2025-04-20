import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

// Components
import MangaCard from "../../components/common/MangaCard";

// Actions
import { fetchMangaList, fetchRecentManga, testApiConnection } from "../../services/actions/mangaActions";
import { mangaAPI } from "../../services/api";

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { mangaList, recentManga, loading, error, recentLoading, recentError, bookmarks } = useSelector((state) => state.manga);
    const user = useSelector((state) => state.auth.user);
    const [connectionRetries, setConnectionRetries] = useState(0);

    // Function to handle connection testing and retries
    const testConnection = async () => {
        const connected = await dispatch(testApiConnection());
        return connected;
    };

    // Function to force reload the data
    const handleRetryConnection = async () => {
        setConnectionRetries((prev) => prev + 1);

        // Try the next API URL
        mangaAPI.tryNextApiUrl();

        // Test connection with the new URL
        const connected = await testConnection();

        if (connected) {
            // If connected, reload the data
            dispatch(fetchMangaList({ type: "popular" }));
            dispatch(fetchRecentManga());
            Alert.alert("Connection restored", `Connected to: ${mangaAPI.getCurrentApiUrl()}`);
        } else if (connectionRetries < 3) {
            // Try again with another URL if we haven't reached max retries
            handleRetryConnection();
        } else {
            Alert.alert("Connection Failed", "Could not connect to any API endpoints. Please check your network or try again later.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            // Test connection first
            const connected = await testConnection();

            if (connected) {
                dispatch(fetchMangaList({ type: "popular" }));
                dispatch(fetchRecentManga());
            } else {
                // If not connected, try a different URL
                handleRetryConnection();
            }
        };

        loadData();
    }, [dispatch]);

    const renderContinueReadingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.continueReadingItem}
            onPress={() =>
                navigation.navigate("MangaStack", {
                    screen: "MangaDetail",
                    params: { mangaId: item.id, title: item.title },
                })
            }
        >
            <MangaCard
                manga={{
                    ...item,
                    coverImage: item.image, // Map image property to coverImage for the MangaCard
                }}
                size="small"
            />
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${item.progress || 50}%` }]} />
            </View>
            <Text style={styles.chapterText}>{item.chapter || "Chapter 1"}</Text>
        </TouchableOpacity>
    );

    const handleMangaPress = (manga) => {
        navigation.navigate("MangaStack", {
            screen: "MangaDetail",
            params: { mangaId: manga.id, title: manga.title },
        });
    };

    const renderMangaItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleMangaPress(item)}>
            <MangaCard
                manga={{
                    ...item,
                    coverImage: item.image, // Map image property to coverImage for the MangaCard
                    author: item.author || "Unknown Author",
                    rating: item.view || "0",
                }}
            />
        </TouchableOpacity>
    );

    // Use the first few bookmarks or mangaList as continue reading
    const continueReadingData =
        bookmarks.length > 0
            ? bookmarks.slice(0, 3)
            : mangaList.slice(0, 3).map((manga) => ({
                  ...manga,
                  progress: Math.random() * 100, // Random progress for demo
              }));

    // Render a connection error component with retry button
    const renderConnectionError = (errorMessage) => (
        <View style={styles.connectionErrorContainer}>
            <Ionicons
                name="cloud-offline"
                size={48}
                color="#FF6B6B"
            />
            <Text style={styles.errorText}>{errorMessage || "Connection error"}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryConnection}
            >
                <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
            <Text style={styles.currentUrlText}>Current URL: {mangaAPI.getCurrentApiUrl()}</Text>
        </View>
    );

    // If both main sections have errors, show a full-page connection error
    if (error && recentError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.fullErrorContainer}>
                    {renderConnectionError("Cannot connect to the server. Please check your network connection.")}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user && typeof user === "object" ? user.name : "Reader"}!</Text>
                        <Text style={styles.subGreeting}>What would you like to read today?</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons
                            name="person-circle"
                            size={40}
                            color="#007AFF"
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

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={continueReadingData}
                            renderItem={renderContinueReadingItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.continueReadingList}
                        />
                    )}
                </View>

                {/* Manga List from API */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Manga</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("MangaStack", {
                                    screen: "MangaList",
                                    params: { listType: "popular" },
                                })
                            }
                        >
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading manga...</Text>
                        </View>
                    ) : error ? (
                        renderConnectionError(error)
                    ) : (
                        <FlatList
                            data={mangaList.slice(0, 6)}
                            renderItem={renderMangaItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.mangaListContainer}
                        />
                    )}
                </View>

                {/* Recently Added */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Added</Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("MangaStack", {
                                    screen: "MangaList",
                                    params: { listType: "recent" },
                                })
                            }
                        >
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading recent manga...</Text>
                        </View>
                    ) : recentError ? (
                        renderConnectionError(recentError)
                    ) : (
                        <FlatList
                            data={recentManga.slice(0, 6)}
                            renderItem={renderMangaItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.mangaListContainer}
                        />
                    )}
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
        paddingBottom: 8,
    },
    continueReadingItem: {
        marginRight: 16,
        width: 150,
    },
    progressContainer: {
        height: 3,
        backgroundColor: "#333333",
        borderRadius: 1.5,
        marginTop: 8,
        marginBottom: 4,
    },
    progressBar: {
        height: 3,
        backgroundColor: "#007AFF",
        borderRadius: 1.5,
    },
    chapterText: {
        fontSize: 12,
        color: "#BDBDBD",
        textAlign: "center",
    },
    mangaListContainer: {
        paddingBottom: 8,
    },
    loadingContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    errorContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 16,
        marginVertical: 12,
        textAlign: "center",
    },
    connectionErrorContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 8,
        margin: 10,
    },
    fullErrorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    retryButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    currentUrlText: {
        color: "#999",
        fontSize: 12,
        marginTop: 10,
    },
});

export default HomeScreen;
