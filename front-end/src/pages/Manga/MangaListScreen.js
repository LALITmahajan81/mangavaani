import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchMangaList, fetchRecentManga } from "../../services/actions/mangaActions";

const MangaListScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { mangaList, loading, error, recentManga, recentLoading, recentError } = useSelector((state) => state.manga);

    // Get list type from route params or default to "popular"
    const listType = route.params?.listType || "popular";

    useEffect(() => {
        // Set the screen title based on list type
        navigation.setOptions({
            title: listType === "popular" ? "Popular Manga" : "Recently Added Manga",
        });

        // Fetch the appropriate data
        if (listType === "popular") {
            dispatch(fetchMangaList({ type: "popular" }));
        } else if (listType === "recent") {
            dispatch(fetchRecentManga());
        }
    }, [dispatch, listType, navigation]);

    // Determine which data and loading states to use
    const currentData = listType === "popular" ? mangaList : recentManga;
    const isLoading = listType === "popular" ? loading : recentLoading;
    const currentError = listType === "popular" ? error : recentError;

    const handleMangaPress = (manga) => {
        navigation.navigate("MangaDetail", {
            mangaId: manga.id,
            title: manga.title,
        });
    };

    const renderMangaItem = ({ item }) => (
        <TouchableOpacity
            style={styles.mangaItem}
            onPress={() => handleMangaPress(item)}
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
                <Text style={styles.mangaChapter}>{item.chapter || "No chapters"}</Text>
                <Text style={styles.mangaViews}>{item.view || "0"} views</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#007AFF"
                />
                <Text style={styles.loadingText}>Loading manga...</Text>
            </View>
        );
    }

    if (currentError) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{currentError}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => (listType === "popular" ? dispatch(fetchMangaList({ type: "popular" })) : dispatch(fetchRecentManga()))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {currentData.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No manga found</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => (listType === "popular" ? dispatch(fetchMangaList({ type: "popular" })) : dispatch(fetchRecentManga()))}
                    >
                        <Text style={styles.retryButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMangaItem}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    listContainer: {
        padding: 10,
    },
    mangaItem: {
        flex: 1,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "#2A2A2A",
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
        color: "#FFFFFF",
    },
    mangaChapter: {
        fontSize: 12,
        color: "#BDBDBD",
        marginBottom: 2,
    },
    mangaViews: {
        fontSize: 12,
        color: "#BDBDBD",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FF6B6B",
        textAlign: "center",
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#BDBDBD",
        textAlign: "center",
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#FFFFFF",
    },
    retryButton: {
        marginTop: 10,
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
});

export default MangaListScreen;
