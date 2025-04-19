import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchMangaDetails, fetchMangaChapters, addBookmark, removeBookmark } from "../../services/actions/mangaActions";

const MangaDetailScreen = ({ route, navigation }) => {
    const { mangaId, title } = route.params;
    const dispatch = useDispatch();
    const { currentManga, chapters, chapterCount, loading, error, bookmarks } = useSelector((state) => state.manga);

    // Chapter pagination state
    const [visibleChapters, setVisibleChapters] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const chaptersPerPage = 10;
    const [sortOrder, setSortOrder] = useState("desc"); // "desc" (newest first) or "asc" (oldest first)

    // Check if manga is bookmarked
    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === mangaId);

    useEffect(() => {
        // Set screen title
        navigation.setOptions({
            title: title || "Manga Details",
        });

        // Fetch manga details and chapters
        dispatch(fetchMangaDetails(mangaId));
        dispatch(fetchMangaChapters(mangaId));
    }, [dispatch, mangaId, navigation, title]);

    // Update visible chapters when chapters data changes or page changes
    useEffect(() => {
        if (chapters && chapters.length > 0) {
            // Sort chapters based on current sort order
            const sortedChapters = [...chapters].sort((a, b) => {
                const numA = parseInt(a.number) || 0;
                const numB = parseInt(b.number) || 0;
                return sortOrder === "desc" ? numB - numA : numA - numB;
            });

            // Get subset of chapters based on current page
            const endIndex = page * chaptersPerPage;
            const newVisibleChapters = sortedChapters.slice(0, endIndex);

            // Check if we've reached the end
            setHasMore(endIndex < sortedChapters.length);

            // Update visible chapters
            setVisibleChapters(newVisibleChapters);
        }
    }, [chapters, page, sortOrder]);

    const loadMoreChapters = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
        // Reset pagination when changing sort order
        setPage(1);
    };

    const handleChapterPress = (chapterId) => {
        navigation.navigate("ChapterReader", {
            mangaId,
            chapterId,
            title: title || "Chapter",
        });
    };

    const toggleBookmark = () => {
        if (isBookmarked) {
            dispatch(removeBookmark(mangaId));
        } else if (currentManga) {
            dispatch(addBookmark(currentManga));
        }
    };

    if (loading || !currentManga) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#007AFF"
                    />
                    <Text style={styles.loadingText}>Loading manga details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            dispatch(fetchMangaDetails(mangaId));
                            dispatch(fetchMangaChapters(mangaId));
                        }}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Hero Header */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: currentManga.image }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerOverlay} />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Manga Info Section */}
                    <View style={styles.infoSection}>
                        <Image
                            source={{ uri: currentManga.image }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                        <View style={styles.details}>
                            <Text style={styles.title}>{currentManga.title}</Text>
                            <View style={styles.viewsRow}>
                                <Ionicons
                                    name="eye-outline"
                                    size={16}
                                    color="#BDBDBD"
                                />
                                <Text style={styles.viewsText}>{currentManga.view || "0 views"}</Text>
                            </View>
                            <View style={styles.statusRow}>
                                <Text style={styles.statusText}>{currentManga.status || "Unknown status"}</Text>
                            </View>
                            <View style={styles.chapterCountRow}>
                                <Ionicons
                                    name="book-outline"
                                    size={16}
                                    color="#BDBDBD"
                                />
                                <Text style={styles.chapterCountText}>{chapterCount} chapters</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={toggleBookmark}
                        >
                            <Ionicons
                                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                size={24}
                                color={isBookmarked ? "#FF9800" : "#FFFFFF"}
                            />
                            <Text style={styles.actionText}>{isBookmarked ? "Bookmarked" : "Bookmark"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons
                                name="download-outline"
                                size={24}
                                color="#FFFFFF"
                            />
                            <Text style={styles.actionText}>Download</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons
                                name="share-social-outline"
                                size={24}
                                color="#FFFFFF"
                            />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{currentManga.description || "No description available."}</Text>
                    </View>

                    {/* Genres */}
                    {currentManga.genres && currentManga.genres.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Genres</Text>
                            <View style={styles.genreContainer}>
                                {currentManga.genres.map((genre, index) => (
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

                    {/* Chapters */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleContainer}>
                                <Text style={styles.sectionTitle}>Chapters</Text>
                                <Text style={styles.chaptersCount}>
                                    {visibleChapters.length} of {chapterCount}
                                </Text>
                            </View>

                            {/* Sort order toggle button */}
                            <TouchableOpacity
                                style={styles.sortButton}
                                onPress={toggleSortOrder}
                            >
                                <Ionicons
                                    name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
                                    size={16}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.sortButtonText}>{sortOrder === "desc" ? "Newest" : "Oldest"} First</Text>
                            </TouchableOpacity>
                        </View>

                        {visibleChapters.length > 0 ? (
                            <>
                                {/* Chapter list */}
                                {visibleChapters.map((chapter, index) => (
                                    <TouchableOpacity
                                        key={chapter.id || index}
                                        style={styles.chapterRow}
                                        onPress={() => handleChapterPress(chapter.id)}
                                    >
                                        <Text style={styles.chapterNumber}>{chapter.number || index + 1}</Text>
                                        <Text style={styles.chapterTitle}>{chapter.title || `Chapter ${chapter.number || index + 1}`}</Text>
                                        <Text style={styles.chapterDate}>{chapter.date || "Unknown"}</Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={18}
                                            color="#BDBDBD"
                                        />
                                    </TouchableOpacity>
                                ))}

                                {/* Load more button */}
                                {hasMore && (
                                    <TouchableOpacity
                                        style={styles.loadMoreButton}
                                        onPress={loadMoreChapters}
                                    >
                                        <Text style={styles.loadMoreText}>
                                            Load More Chapters ({visibleChapters.length} of {chapterCount})
                                        </Text>
                                        <Ionicons
                                            name="chevron-down"
                                            size={16}
                                            color="#007AFF"
                                        />
                                    </TouchableOpacity>
                                )}

                                {/* Loaded all chapters indicator */}
                                {!hasMore && chapterCount > 10 && (
                                    <View style={styles.allLoadedContainer}>
                                        <Text style={styles.allLoadedText}>All {chapterCount} chapters loaded</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <Text style={styles.noChaptersText}>No chapters available.</Text>
                        )}
                    </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#FFFFFF",
    },
    errorContainer: {
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
    header: {
        height: 200,
        position: "relative",
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    coverImage: {
        width: "100%",
        height: "100%",
    },
    content: {
        marginTop: -40,
        backgroundColor: "#1E1E1E",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    infoSection: {
        flexDirection: "row",
        marginTop: 16,
        marginBottom: 20,
    },
    thumbnail: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginTop: -30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    details: {
        flex: 1,
        marginLeft: 16,
        paddingTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    viewsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    viewsText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#BDBDBD",
    },
    statusRow: {
        marginBottom: 8,
    },
    statusText: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "bold",
    },
    chapterCountRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    chapterCountText: {
        marginLeft: 8,
        fontSize: 14,
        color: "#BDBDBD",
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#333333",
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        marginTop: 4,
        fontSize: 12,
        color: "#BDBDBD",
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: "column",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    chaptersCount: {
        fontSize: 14,
        color: "#BDBDBD",
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333333",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    sortButtonText: {
        fontSize: 12,
        color: "#FFFFFF",
        marginLeft: 4,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#BDBDBD",
    },
    genreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    genreTag: {
        backgroundColor: "#333333",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        margin: 4,
    },
    genreText: {
        fontSize: 12,
        color: "#FFFFFF",
    },
    chapterRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },
    chapterNumber: {
        width: 30,
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    chapterTitle: {
        flex: 1,
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 8,
    },
    chapterDate: {
        fontSize: 12,
        color: "#BDBDBD",
        marginRight: 8,
    },
    noChaptersText: {
        fontSize: 14,
        color: "#BDBDBD",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 12,
    },
    loadMoreButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: "#2A2A2A",
        borderRadius: 8,
    },
    loadMoreText: {
        fontSize: 14,
        color: "#007AFF",
        marginRight: 8,
    },
    allLoadedContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: "#2A2A2A",
        borderRadius: 8,
    },
    allLoadedText: {
        fontSize: 14,
        color: "#FFFFFF",
        marginRight: 8,
    },
});

export default MangaDetailScreen;
