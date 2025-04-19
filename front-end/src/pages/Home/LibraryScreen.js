import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

// Components
import MangaCard from "../../components/common/MangaCard";

// Mock data (would normally come from Redux)
const mockBookmarks = [
    {
        id: "1",
        title: "One Piece",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Eiichiro Oda",
        rating: "4.9",
    },
    {
        id: "2",
        title: "Demon Slayer",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Koyoharu Gotouge",
        rating: "4.8",
    },
    {
        id: "3",
        title: "My Hero Academia",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Kohei Horikoshi",
        rating: "4.7",
    },
];

const mockDownloads = [
    {
        id: "4",
        title: "Tokyo Revengers",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Ken Wakui",
        rating: "4.6",
    },
    {
        id: "5",
        title: "Jujutsu Kaisen",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Gege Akutami",
        rating: "4.8",
    },
];

const mockHistory = [
    {
        id: "6",
        title: "Solo Leveling",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Chugong",
        rating: "4.9",
        lastRead: "Chapter 179",
        readDate: "2 days ago",
    },
    {
        id: "7",
        title: "Chainsaw Man",
        coverImage: "https://via.placeholder.com/150x200",
        author: "Tatsuki Fujimoto",
        rating: "4.8",
        lastRead: "Chapter 97",
        readDate: "1 week ago",
    },
];

const LibraryScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState("bookmarks");
    const bookmarks = useSelector((state) => state.manga.bookmarks) || mockBookmarks;
    const downloads = useSelector((state) => state.manga.downloads) || mockDownloads;

    const renderEmptyState = (message) => (
        <View style={styles.emptyContainer}>
            <Ionicons
                name="book-outline"
                size={64}
                color="#BDBDBD"
            />
            <Text style={styles.emptyText}>{message}</Text>
        </View>
    );

    const renderMangaItem = ({ item }) => (
        <View style={styles.mangaItem}>
            <MangaCard
                manga={item}
                size="medium"
            />
            {activeTab === "history" && (
                <View style={styles.historyInfo}>
                    <Text style={styles.lastReadText}>{item.lastRead}</Text>
                    <Text style={styles.readDateText}>{item.readDate}</Text>
                </View>
            )}
        </View>
    );

    const getData = () => {
        switch (activeTab) {
            case "bookmarks":
                return bookmarks.length > 0 ? bookmarks : [];
            case "downloads":
                return downloads.length > 0 ? downloads : [];
            case "history":
                return mockHistory;
            default:
                return [];
        }
    };

    const getEmptyMessage = () => {
        switch (activeTab) {
            case "bookmarks":
                return "You haven't bookmarked any manga yet";
            case "downloads":
                return "You haven't downloaded any manga yet";
            case "history":
                return "Your reading history will appear here";
            default:
                return "No items to display";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Library</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "bookmarks" && styles.activeTab]}
                    onPress={() => setActiveTab("bookmarks")}
                >
                    <Text style={[styles.tabText, activeTab === "bookmarks" && styles.activeTabText]}>Bookmarks</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "downloads" && styles.activeTab]}
                    onPress={() => setActiveTab("downloads")}
                >
                    <Text style={[styles.tabText, activeTab === "downloads" && styles.activeTabText]}>Downloads</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "history" && styles.activeTab]}
                    onPress={() => setActiveTab("history")}
                >
                    <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={getData()}
                renderItem={renderMangaItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState(getEmptyMessage())}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
    },
    header: {
        padding: 16,
        backgroundColor: "#1E1E1E",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        borderBottomWidth: 1,
        borderColor: "#333333",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#007AFF",
    },
    tabText: {
        fontSize: 14,
        color: "#BDBDBD",
    },
    activeTabText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
        flexGrow: 1,
    },
    mangaItem: {
        flex: 1,
        margin: 8,
        maxWidth: "50%",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        marginTop: 64,
    },
    emptyText: {
        fontSize: 16,
        color: "#BDBDBD",
        textAlign: "center",
        marginTop: 16,
    },
    historyInfo: {
        marginTop: 8,
    },
    lastReadText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    readDateText: {
        fontSize: 12,
        color: "#BDBDBD",
    },
});

export default LibraryScreen;
