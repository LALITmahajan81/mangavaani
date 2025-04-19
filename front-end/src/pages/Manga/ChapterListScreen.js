import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchMangaChapters } from "../../services/actions/mangaActions";

// Mock data for chapters
const mockChapters = [
    { id: "101", title: "Chapter 1", number: "1", date: "2021-09-01" },
    { id: "102", title: "Chapter 2", number: "2", date: "2021-09-08" },
    { id: "103", title: "Chapter 3", number: "3", date: "2021-09-15" },
    { id: "104", title: "Chapter 4", number: "4", date: "2021-09-22" },
    { id: "105", title: "Chapter 5", number: "5", date: "2021-09-29" },
    { id: "106", title: "Chapter 6", number: "6", date: "2021-10-06" },
    { id: "107", title: "Chapter 7", number: "7", date: "2021-10-13" },
    { id: "108", title: "Chapter 8", number: "8", date: "2021-10-20" },
    { id: "109", title: "Chapter 9", number: "9", date: "2021-10-27" },
    { id: "110", title: "Chapter 10", number: "10", date: "2021-11-03" },
    { id: "111", title: "Chapter 11", number: "11", date: "2021-11-10" },
    { id: "112", title: "Chapter 12", number: "12", date: "2021-11-17" },
    { id: "113", title: "Chapter 13", number: "13", date: "2021-11-24" },
    { id: "114", title: "Chapter 14", number: "14", date: "2021-12-01" },
    { id: "115", title: "Chapter 15", number: "15", date: "2021-12-08" },
];

const ChapterListScreen = ({ route, navigation }) => {
    const { id, title } = route.params;
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
    const [filterDownloaded, setFilterDownloaded] = useState(false);

    const dispatch = useDispatch();
    const { chapters, loading, error, downloads } = useSelector((state) => state.manga);

    // Use mock data when API isn't available
    const mangaChapters = chapters.length > 0 ? chapters : mockChapters;

    useEffect(() => {
        if (id) {
            dispatch(fetchMangaChapters(id));
        }

        // Set title in header
        navigation.setOptions({
            title: title || "Chapters",
        });
    }, [dispatch, id, navigation, title]);

    // Sort chapters based on the sort order
    const sortedChapters = [...mangaChapters].sort((a, b) => {
        const numA = parseFloat(a.number);
        const numB = parseFloat(b.number);

        return sortOrder === "asc" ? numA - numB : numB - numA;
    });

    // Filter chapters if needed
    const filteredChapters = filterDownloaded
        ? sortedChapters.filter((chapter) => downloads.some((download) => download.id === chapter.id))
        : sortedChapters;

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Toggle downloaded filter
    const toggleFilterDownloaded = () => {
        setFilterDownloaded(!filterDownloaded);
    };

    // Navigate to reader screen
    const handleReadChapter = (chapter) => {
        navigation.navigate("Reader", {
            mangaId: id,
            chapterId: chapter.id,
            mangaTitle: title,
            chapterNumber: chapter.number,
        });
    };

    // Render chapter item
    const renderChapterItem = ({ item }) => {
        const isDownloaded = downloads.some((download) => download.id === item.id);

        return (
            <TouchableOpacity
                style={styles.chapterItem}
                onPress={() => handleReadChapter(item)}
            >
                <View style={styles.chapterInfo}>
                    <Text style={styles.chapterTitle}>{item.title}</Text>
                    <Text style={styles.chapterDate}>{item.date}</Text>
                </View>

                {isDownloaded && (
                    <Ionicons
                        name="cloud-done"
                        size={20}
                        color="#6C63FF"
                    />
                )}
            </TouchableOpacity>
        );
    };

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons
                name="book-outline"
                size={64}
                color="#BDBDBD"
            />
            <Text style={styles.emptyText}>{filterDownloaded ? "No downloaded chapters" : "No chapters available"}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Filter bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleSortOrder}
                >
                    <Text style={styles.filterButtonText}>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</Text>
                    <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={16}
                        color="#6C63FF"
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, filterDownloaded && styles.activeFilterButton]}
                    onPress={toggleFilterDownloaded}
                >
                    <Text style={[styles.filterButtonText, filterDownloaded && styles.activeFilterButtonText]}>Downloaded Only</Text>
                    <Ionicons
                        name="cloud-download"
                        size={16}
                        color={filterDownloaded ? "#FFFFFF" : "#6C63FF"}
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Chapter list */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#6C63FF"
                    />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredChapters}
                    renderItem={renderChapterItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    filterBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    activeFilterButton: {
        backgroundColor: "#6C63FF",
        borderColor: "#6C63FF",
    },
    filterButtonText: {
        fontSize: 14,
        color: "#757575",
    },
    activeFilterButtonText: {
        color: "#FFFFFF",
    },
    filterIcon: {
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        color: "#F50057",
        fontSize: 16,
        textAlign: "center",
    },
    listContent: {
        padding: 16,
        flexGrow: 1,
    },
    chapterItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    chapterInfo: {
        flex: 1,
    },
    chapterTitle: {
        fontSize: 16,
        color: "#212121",
        marginBottom: 4,
    },
    chapterDate: {
        fontSize: 12,
        color: "#757575",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#757575",
        marginTop: 16,
        textAlign: "center",
    },
});

export default ChapterListScreen;
