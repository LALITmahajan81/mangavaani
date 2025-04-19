import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    useWindowDimensions,
    StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchChapterDetails, fetchMangaChapters, fetchChapterImagesSimple } from "../services/actions/mangaActions";
import { getImageFallback } from "../utils/mangadexUtils";

// MangaPage component to handle individual page rendering and error states
const MangaPage = ({ item, index, totalPages, screenWidth, onPress }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(item);

    // Handle image loading error
    const handleImageError = () => {
        console.log(`Failed to load image at ${imageUrl}, using fallback`);

        // If this is already the fallback image, just mark as error
        if (imageUrl !== item) {
            setImageError(true);
            setImageLoading(false);
            return;
        }

        // Try the data-saver version first
        const fallbackUrl = getImageFallback(item, true);
        setImageUrl(fallbackUrl);

        // If the fallback is just a placeholder, mark as error
        if (fallbackUrl.includes("placehold.co")) {
            setImageError(true);
        }

        setImageLoading(false);
    };

    return (
        <TouchableOpacity
            style={[styles.imageContainer, { width: screenWidth }]}
            onPress={onPress}
            activeOpacity={1}
        >
            {imageLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />
                    <Text style={styles.loadingText}>Loading page {index + 1}...</Text>
                </View>
            )}
            <Image
                source={{ uri: imageUrl }}
                style={[styles.pageImage, { width: screenWidth }]}
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={handleImageError}
            />
            {imageError && (
                <View style={styles.errorOverlay}>
                    <Text style={styles.errorText}>Image could not be loaded</Text>
                    <Text style={styles.errorSubText}>URL: {item.substring(0, 40)}...</Text>
                </View>
            )}
            <Text style={styles.pageNumber}>
                {index + 1} / {totalPages}
            </Text>
        </TouchableOpacity>
    );
};

// Loading indicator component
const LoadingIndicator = ({ message }) => (
    <View style={styles.centered}>
        <ActivityIndicator
            size="large"
            color="#FFFFFF"
        />
        <Text style={styles.loadingText}>{message || "Loading..."}</Text>
    </View>
);

const ChapterReader = ({ route, navigation }) => {
    const { mangaId, chapterId, title } = route.params;
    const [pageIndex, setPageIndex] = useState(0);
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
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
        StatusBar.setHidden(true);

        // Clean up
        return () => {
            StatusBar.setHidden(false);
        };
    }, [dispatch, mangaId]);

    // Fetch chapter details when currentChapterId changes
    useEffect(() => {
        if (currentChapterId) {
            // Use the simpler method to fetch chapter images
            dispatch(fetchChapterImagesSimple(mangaId, currentChapterId));
        }
    }, [dispatch, mangaId, currentChapterId]);

    // Toggle reader controls visibility
    const toggleControls = useCallback(() => {
        setShowControls((prev) => !prev);
    }, []);

    // Navigate back to manga details
    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    // Navigate to next or previous chapter
    const navigateChapter = useCallback(
        (direction) => {
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
        },
        [chapters, currentChapterId]
    );

    const renderItem = useCallback(
        ({ item, index }) => (
            <MangaPage
                item={item}
                index={index}
                totalPages={images.length}
                screenWidth={screenWidth}
                onPress={toggleControls}
            />
        ),
        [toggleControls, screenWidth, images.length]
    );

    const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setPageIndex(viewableItems[0].index);
        }
    }, []);

    if (loading) {
        return <LoadingIndicator message="Loading chapter from MangaDex..." />;
    }

    if (error || images.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || "No images found for this chapter."}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchChapterImagesSimple(mangaId, currentChapterId))}
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
                            disabled={chapterPosition <= 1}
                        >
                            <Ionicons
                                name="chevron-back-circle"
                                size={32}
                                color={chapterPosition <= 1 ? "#555555" : "#FFFFFF"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => navigateChapter("next")}
                            disabled={chapterPosition >= totalChapters}
                        >
                            <Ionicons
                                name="chevron-forward-circle"
                                size={32}
                                color={chapterPosition >= totalChapters ? "#555555" : "#FFFFFF"}
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
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
                initialScrollIndex={pageIndex}
                getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
                horizontal
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                    setPageIndex(newIndex);
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
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
    },
    loadingText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginTop: 10,
    },
    errorText: {
        color: "#F44336",
        fontSize: 16,
        textAlign: "center",
        marginHorizontal: 20,
    },
    errorSubText: {
        color: "#BDBDBD",
        fontSize: 12,
        marginTop: 5,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    controls: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 15,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    controlText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 5,
    },
    chapterTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    chapterInfo: {
        color: "#BDBDBD",
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
    },
    navigationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    navButton: {
        padding: 10,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        position: "relative",
    },
    pageImage: {
        height: "100%",
        resizeMode: "contain",
    },
    pageNumber: {
        position: "absolute",
        bottom: 15,
        right: 15,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "#FFFFFF",
        padding: 5,
        borderRadius: 5,
    },
    errorOverlay: {
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 5,
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 5,
    },
});

export default ChapterReader;
