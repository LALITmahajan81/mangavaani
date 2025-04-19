import React, { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet, ActivityIndicator, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchChapterDetails, fetchMangaChapters } from "../services/actions/mangaActions";

const ChapterReader = ({ route, navigation }) => {
    const { mangaId, chapterId, title } = route.params;
    const [pageIndex, setPageIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const [showControls, setShowControls] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(chapterId);

    const dispatch = useDispatch();
    const { currentChapter, chapters, loading, error } = useSelector((state) => state.manga);

    // Get chapter images from Redux
    const images = currentChapter?.images || [];

    useEffect(() => {
        // Fetch manga chapters for navigation
        dispatch(fetchMangaChapters(mangaId));

        // Hide status bar for immersive reading
        StatusBar.setStatusBarHidden(true, "fade");

        // Clean up
        return () => {
            StatusBar.setStatusBarHidden(false, "fade");
        };
    }, [dispatch, mangaId]);

    // Fetch chapter details when currentChapterId changes
    useEffect(() => {
        if (currentChapterId) {
            dispatch(fetchChapterDetails(mangaId, currentChapterId));
        }
    }, [dispatch, mangaId, currentChapterId]);

    // Toggle reader controls visibility
    const toggleControls = () => {
        setShowControls(!showControls);
    };

    // Navigate back to manga details
    const handleBack = () => {
        navigation.goBack();
    };

    // Navigate to next or previous chapter
    const navigateChapter = (direction) => {
        if (!chapters || chapters.length === 0) return;

        // Find current chapter index
        const currentIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId);
        if (currentIndex === -1) return;

        // Calculate next/previous index
        const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

        // Check if index is valid
        if (newIndex < 0) {
            Alert.alert("First Chapter", "You're already at the first chapter.");
            return;
        }

        if (newIndex >= chapters.length) {
            Alert.alert("Last Chapter", "You've reached the last chapter.");
            return;
        }

        // Navigate to new chapter
        setCurrentChapterId(chapters[newIndex].id);
        setPageIndex(0); // Reset to first page
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.imageContainer}
            onPress={toggleControls}
            activeOpacity={1}
        >
            <Image
                source={{ uri: item }}
                style={[styles.pageImage, { width: screenWidth }]}
                resizeMode="contain"
            />
            <Text style={styles.pageNumber}>
                {index + 1} / {images.length}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#FFFFFF"
                />
                <Text style={styles.loadingText}>Loading chapter...</Text>
            </View>
        );
    }

    if (error || images.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || "No images found for this chapter."}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchChapterDetails(mangaId, currentChapterId))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.retryButton, { marginTop: 10 }]}
                    onPress={handleBack}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Find current chapter details and chapter count/position
    const currentChapterObj = chapters ? chapters.find((c) => c.id === currentChapterId) : null;
    const currentChapterTitle = currentChapterObj ? currentChapterObj.title || `Chapter ${currentChapterObj.number}` : "Chapter";

    // Find position/index of current chapter in the list
    const chapterPosition = chapters ? chapters.findIndex((c) => c.id === currentChapterId) + 1 : 0;
    const totalChapters = chapters ? chapters.length : 0;

    return (
        <View style={styles.container}>
            {showControls && (
                <SafeAreaView style={styles.controls}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color="#FFFFFF"
                        />
                        <Text style={styles.controlText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.chapterTitle}>{currentChapterTitle}</Text>
                    <Text style={styles.chapterInfo}>
                        Chapter {currentChapterObj?.number || "?"} of {totalChapters}
                    </Text>

                    <View style={styles.navigationButtons}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateChapter("prev")}
                        >
                            <Ionicons
                                name="chevron-back-circle"
                                size={32}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateChapter("next")}
                        >
                            <Ionicons
                                name="chevron-forward-circle"
                                size={32}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            )}

            <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(_, index) => `page-${currentChapterId}-${index}`}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (viewableItems.length > 0) {
                        setPageIndex(viewableItems[0].index);
                    }
                }}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    imageContainer: {
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    pageImage: {
        height: Dimensions.get("window").height - 50,
    },
    pageNumber: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "#FFFFFF",
        padding: 8,
        borderRadius: 5,
        fontSize: 12,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FF6B6B",
        textAlign: "center",
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 14,
        color: "#FFFFFF",
        marginTop: 12,
    },
    controls: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    controlText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 8,
    },
    chapterTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 8,
    },
    chapterInfo: {
        color: "#FFFFFF",
        fontSize: 14,
        textAlign: "center",
        marginVertical: 8,
    },
    navigationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 20,
    },
    navButton: {
        padding: 8,
    },
    retryButton: {
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

export default ChapterReader;
