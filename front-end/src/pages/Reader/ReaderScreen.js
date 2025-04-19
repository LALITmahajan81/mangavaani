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

    const dispatch = useDispatch();
    const { currentChapter, loading, error } = useSelector((state) => state.manga);
    const { readingMode } = useSelector((state) => state.settings);

    // Get chapter images (from API or mock)
    const chapterImages = currentChapter?.images || mockChapterImages;

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
    }, [dispatch, mangaId, chapterId, chapterImages.length]);

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
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={toggleControls}
                onLongPress={toggleControls}
                style={styles.pageContainer}
            >
                <Image
                    source={{ uri: item }}
                    style={styles.pageImage}
                    resizeMode="contain"
                />
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
            initialScrollIndex={readingMode === "rightToLeft" ? totalPages - 1 : 0}
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

    // Loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#6C63FF"
                />
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchChapterDetails(mangaId, chapterId))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main reader based on reading mode */}
            {readingMode === "vertical" ? renderVerticalReader() : renderPagedReader()}

            {/* Controls overlay (conditionally rendered) */}
            {showControls && <ControlsOverlay />}

            {/* Page indicator (always visible) */}
            {!showControls && <PageIndicator />}

            {/* Touch areas for page navigation in paged mode */}
            {readingMode !== "vertical" && !showControls && (
                <View style={styles.touchAreaContainer}>
                    <TouchableOpacity
                        style={styles.touchArea}
                        activeOpacity={0}
                        onPress={handlePress}
                    />
                </View>
            )}
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        padding: 16,
    },
    errorText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 16,
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
        fontSize: 16,
        fontWeight: "bold",
    },
    pageContainer: {
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
    },
    pageImage: {
        width: "100%",
        height: "100%",
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "space-between",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        paddingTop: 40, // Account for status bar
    },
    closeButton: {
        marginRight: 16,
    },
    titleContainer: {
        flex: 1,
    },
    mangaTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    chapterTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        opacity: 0.8,
    },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingBottom: 32, // Extra padding for bottom
    },
    navButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    navButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginHorizontal: 4,
    },
    pageIndicator: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
    },
    pageIndicatorText: {
        color: "#FFFFFF",
        fontSize: 12,
    },
    touchAreaContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    touchArea: {
        flex: 1,
    },
});

export default ReaderScreen;
