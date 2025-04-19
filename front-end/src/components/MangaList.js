import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { mangaAPI } from "../services/api";
import ApiStatusCheck from "./ApiStatusCheck";

const MangaList = ({ navigation }) => {
    const [manga, setManga] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDebug, setShowDebug] = useState(false);

    const fetchManga = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await mangaAPI.getMangaList();
            console.log("API Response:", JSON.stringify(response.data).substring(0, 200) + "...");
            setManga(response.data.mangaList || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching manga:", err);
            let errorMessage = "Failed to load manga. Please try again later.";

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
        fetchManga();
    }, []);

    const handleMangaPress = (mangaId) => {
        navigation.navigate("MangaDetail", { mangaId });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                />
                <Text style={styles.loadingText}>Loading manga...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Button
                    title="Retry"
                    onPress={fetchManga}
                    style={styles.retryButton}
                />
                <View style={{ marginTop: 20 }}>
                    <Button
                        title={showDebug ? "Hide Debug Info" : "Show Debug Info"}
                        onPress={() => setShowDebug(!showDebug)}
                    />
                    {showDebug && <ApiStatusCheck />}
                </View>
            </View>
        );
    }

    const renderMangaItem = ({ item }) => (
        <TouchableOpacity
            style={styles.mangaItem}
            onPress={() => handleMangaPress(item.id)}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.mangaImage}
                resizeMode="cover"
            />
            <View style={styles.mangaInfo}>
                <Text
                    style={styles.mangaTitle}
                    numberOfLines={2}
                >
                    {item.title}
                </Text>
                <Text style={styles.mangaChapter}>{item.chapter}</Text>
                <Text style={styles.mangaViews}>{item.view} views</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {manga.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No manga found</Text>
                    <Button
                        title="Refresh"
                        onPress={fetchManga}
                        style={styles.retryButton}
                    />
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title={showDebug ? "Hide Debug Info" : "Show Debug Info"}
                            onPress={() => setShowDebug(!showDebug)}
                        />
                        {showDebug && <ApiStatusCheck />}
                    </View>
                </View>
            ) : (
                <>
                    <FlatList
                        data={manga}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMangaItem}
                        numColumns={2}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={() => (
                            <>
                                {showDebug && <ApiStatusCheck />}
                                <View style={styles.headerButtons}>
                                    <Button
                                        title={showDebug ? "Hide Debug Info" : "Debug API"}
                                        onPress={() => setShowDebug(!showDebug)}
                                    />
                                </View>
                            </>
                        )}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    listContainer: {
        padding: 10,
    },
    headerButtons: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    mangaItem: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
        maxWidth: "47%",
    },
    mangaImage: {
        width: "100%",
        height: 200,
    },
    mangaInfo: {
        padding: 10,
    },
    mangaTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    mangaChapter: {
        fontSize: 12,
        color: "#666",
        marginBottom: 2,
    },
    mangaViews: {
        fontSize: 12,
        color: "#666",
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
    emptyText: {
        fontSize: 16,
        color: "#666",
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

export default MangaList;
