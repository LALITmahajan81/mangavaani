import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { mangaAPI } from "../services/api";

const MangaDetail = ({ route, navigation }) => {
    const { mangaId } = route.params;
    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMangaDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch manga details first
            const mangaResponse = await mangaAPI.getMangaDetails(mangaId);
            setManga(mangaResponse.data);

            // Then fetch chapters
            const chaptersResponse = await mangaAPI.getMangaChapters(mangaId);
            setChapters(chaptersResponse.data.chapterList || []);

            setLoading(false);
        } catch (err) {
            console.error("Error fetching manga details:", err);
            let errorMessage = "Failed to load manga details. Please try again later.";

            // More helpful error messages based on the type of error
            if (err.message && err.message.includes("Network Error")) {
                errorMessage =
                    "Network error: Could not connect to the server. Please check your connection and ensure the backend server is running.";
            } else if (err.response) {
                // The server responded with a status code outside of 2xx range
                errorMessage = `Server error (${err.response.status}): ${err.response.data?.message || err.message}`;
            }

            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMangaDetails();
    }, [mangaId]);

    const handleChapterPress = (chapterId) => {
        navigation.navigate("ChapterReader", { chapterId });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                />
                <Text style={styles.loadingText}>Loading manga details...</Text>
            </View>
        );
    }

    if (error || !manga) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || "Manga not found"}</Text>
                <Button
                    title="Retry"
                    onPress={fetchMangaDetails}
                    style={styles.retryButton}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: manga.image }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{manga.title}</Text>
                    <Text style={styles.author}>{manga.author || "Unknown Author"}</Text>
                    <Text style={styles.status}>{manga.status || "Unknown Status"}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{manga.description || "No description available."}</Text>
            </View>

            {manga.genres && manga.genres.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Genres</Text>
                    <View style={styles.genreContainer}>
                        {manga.genres.map((genre, index) => (
                            <View
                                key={index}
                                style={styles.genreTag}
                            >
                                <Text style={styles.genreText}>{genre}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Chapters</Text>
                {chapters.length > 0 ? (
                    chapters.map((chapter, index) => (
                        <TouchableOpacity
                            key={chapter.id || index}
                            style={styles.chapterItem}
                            onPress={() => handleChapterPress(chapter.id)}
                        >
                            <Text style={styles.chapterName}>{chapter.name || `Chapter ${index + 1}`}</Text>
                            <Text style={styles.chapterDate}>{chapter.date || "Unknown date"}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noChapters}>No chapters available.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "#fff",
    },
    coverImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    author: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: "#777",
    },
    section: {
        backgroundColor: "#fff",
        padding: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
    },
    genreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    genreTag: {
        backgroundColor: "#e0e0e0",
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 4,
    },
    genreText: {
        fontSize: 12,
        color: "#555",
    },
    chapterItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    chapterName: {
        fontSize: 14,
        color: "#333",
    },
    chapterDate: {
        fontSize: 12,
        color: "#888",
    },
    noChapters: {
        fontSize: 14,
        color: "#888",
        fontStyle: "italic",
        textAlign: "center",
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#333",
    },
    retryButton: {
        marginTop: 10,
    },
});

export default MangaDetail;
