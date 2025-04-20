import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// Actions
import { fetchChapterDetails } from "../../services/actions/mangaActions";

// Mock images for the chapter
const mockChapterImages = [
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
    "https://via.placeholder.com/800x1200",
];

const { width, height } = Dimensions.get("window");

const ReaderScreen = ({ route, navigation }) => {
    const { mangaId, chapterId, mangaTitle, chapterNumber } = route.params;
    const [showControls, setShowControls] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [orientation, setOrientation] = useState("portrait");
    const [imageErrors, setImageErrors] = useState({});

    const dispatch = useDispatch();
    const { currentChapter, loading, error, currentManga } = useSelector((state) => state.manga);
    const { readingMode } = useSelector((state) => state.settings);

    // Get chapter images (fallback to empty array if not available)
    const chapterImages = currentChapter?.images || [];

    useEffect(() => {
        // Fetch chapter details from API
        if (mangaId && chapterId) {
            dispatch(fetchChapterDetails(mangaId, chapterId));
        }

        // Hide status bar for immersive reading
        StatusBar.setHidden(true);

        // Set total pages
        setTotalPages(chapterImages.length);

        // Clean up
        return () => {
            StatusBar.setHidden(false);
        };
    }, [dispatch, mangaId, chapterId]);

    // Update total pages when chapter images change
    useEffect(() => {
        setTotalPages(chapterImages.length);
    }, [chapterImages]);

    // Toggle reader controls visibility
    const toggleControls = () => {
        setShowControls(!showControls);
    };

    // Navigate to next/previous page
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle reader gestures based on reading mode
    const handlePress = (event) => {
        const { locationX } = event.nativeEvent;

        // Check which side of the screen was tapped
        const pressedLeftSide = locationX < width / 2;

        if (readingMode === "rightToLeft") {
            // Right-to-left mode (manga style)
            if (pressedLeftSide) {
                goToNextPage();
            } else {
                goToPrevPage();
            }
        } else {
            // Left-to-right mode (western style)
            if (pressedLeftSide) {
                goToPrevPage();
            } else {
                goToNextPage();
            }
        }
    };

    // Generate fallback image URL using dummyimage.com
    const getFallbackImageUrl = (index) => {
        const pageNum = index + 1;
        const title = mangaTitle || "Manga";
        const chapter = chapterNumber || "1";

        // Encode the text for URL
        const encodedText = encodeURIComponent(`${title} Ch.${chapter} Pg.${pageNum}`);

        // Return the dummyimage.com URL
        return `https://dummyimage.com/800x1200/cccccc/000000&text=${encodedText}`;
    };

    // Handle image loading error
    const handleImageError = (index) => {
        setImageErrors((prev) => ({
            ...prev,
            [index]: true,
        }));
        console.log(`Error loading image at index ${index}, using fallback`);
    };

    // Page indicator component
    const PageIndicator = () => (
        <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
                {currentPage} / {totalPages}
            </Text>
        </View>
    );

    // Controls overlay component
    const ControlsOverlay = () => (
        <View style={styles.controlsOverlay}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="close"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text
                        style={styles.mangaTitle}
                        numberOfLines={1}
                    >
                        {mangaTitle}
                    </Text>
                    <Text style={styles.chapterTitle}>Chapter {chapterNumber}</Text>
                </View>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                        /* Navigate to previous chapter */
                    }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#FFFFFF"
                    />
                    <Text style={styles.navButtonText}>Prev</Text>
                </TouchableOpacity>

                <PageIndicator />

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                        /* Navigate to next chapter */
                    }}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Render page based on reading mode
    const renderPage = ({ item, index }) => {
        // Use fallback image URL if there was an error loading the original image
        const imageSource = imageErrors[index] ? { uri: getFallbackImageUrl(index) } : { uri: item };

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={toggleControls}
                onLongPress={toggleControls}
                style={styles.pageContainer}
            >
                <Image
                    source={imageSource}
                    style={styles.pageImage}
                    resizeMode="contain"
                    onError={() => handleImageError(index)}
                />
                <Text style={styles.pageNumber}>
                    {index + 1} / {totalPages}
                </Text>
            </TouchableOpacity>
        );
    };

    // Render vertical scroll reader
    const renderVerticalReader = () => (
        <FlatList
            data={chapterImages}
            renderItem={renderPage}
            keyExtractor={(_, index) => `page-${index}`}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
                // Calculate current page based on scroll position
                const offsetY = e.nativeEvent.contentOffset.y;
                const pageIndex = Math.floor(offsetY / height) + 1;
                setCurrentPage(pageIndex > totalPages ? totalPages : pageIndex);
            }}
            scrollEventThrottle={16}
        />
    );

    // Render paged reader (left-to-right or right-to-left)
    const renderPagedReader = () => (
        <FlatList
            data={readingMode === "rightToLeft" ? [...chapterImages].reverse() : chapterImages}
            renderItem={renderPage}
            keyExtractor={(_, index) => `page-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={0}
            getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
            onScroll={(e) => {
                // Calculate current page based on scroll position
                const offsetX = e.nativeEvent.contentOffset.x;
                const pageIndex = Math.floor(offsetX / width) + 1;
                setCurrentPage(pageIndex > totalPages ? totalPages : pageIndex);
            }}
            scrollEventThrottle={16}
        />
    );

    // If no images are available, render fallback images
    if ((chapterImages.length === 0 || error) && !loading) {
        // Generate fallback images (5 pages)
        const fallbackImages = Array.from({ length: 5 }, (_, i) => getFallbackImageUrl(i));

        // If in loaded state but no images, use the fallback images
        if (!loading) {
            return (
                <View style={styles.container}>
                    {showControls && <ControlsOverlay />}
                    <FlatList
                        data={fallbackImages}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={toggleControls}
                                style={styles.pageContainer}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={styles.pageImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.pageNumber}>
                                    {index + 1} / {fallbackImages.length}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(_, index) => `fallback-page-${index}`}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            );
        }
    }

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#6C63FF"
                />
                <Text style={styles.loadingText}>Loading chapter...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {showControls && <ControlsOverlay />}
            {readingMode === "vertical" ? renderVerticalReader() : renderPagedReader()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
    },
    loadingText: {
        color: "#FFFFFF",
        marginTop: 12,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        padding: 20,
    },
    errorText: {
        color: "#FF6B6B",
        marginBottom: 20,
        fontSize: 16,
        textAlign: "center",
    },
    retryButton: {
        backgroundColor: "#6C63FF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    pageContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    pageImage: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 60,
    },
    pageNumber: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        color: "#FFFFFF",
        fontSize: 12,
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 10,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    titleContainer: {
        flex: 1,
        marginLeft: 16,
    },
    mangaTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    chapterTitle: {
        color: "#BDBDBD",
        fontSize: 14,
        marginTop: 4,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    navButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    navButtonText: {
        color: "#FFFFFF",
        marginHorizontal: 4,
    },
    pageIndicator: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pageIndicatorText: {
        color: "#FFFFFF",
    },
});

export default ReaderScreen;
