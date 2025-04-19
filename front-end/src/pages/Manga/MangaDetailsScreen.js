import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

// Actions
import { fetchMangaDetails, fetchMangaChapters, addBookmark, removeBookmark, addDownload, removeDownload } from "../../services/actions/mangaActions";

// Add more specific mock data for different manga IDs
const mangaDetailsMap = {
    1: {
        id: "1",
        title: "One Piece",
        coverImage: "https://via.placeholder.com/300x450",
        author: "Eiichiro Oda",
        artist: "Eiichiro Oda",
        status: "Ongoing",
        releaseYear: "1997",
        genres: ["Action", "Adventure", "Comedy", "Fantasy", "Shounen"],
        rating: "4.9",
        description:
            'Gol D. Roger, a man referred to as the "Pirate King," is set to be executed by the World Government. But just before his death, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the Pirate King is executed and the Great Age of Pirates begins. Twenty-two years later, a young man named Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new Pirate King.',
    },
    2: {
        id: "2",
        title: "Demon Slayer",
        coverImage: "https://via.placeholder.com/300x450",
        author: "Koyoharu Gotouge",
        artist: "Koyoharu Gotouge",
        status: "Completed",
        releaseYear: "2016",
        genres: ["Action", "Adventure", "Fantasy", "Supernatural"],
        rating: "4.8",
        description:
            "In Taisho-era Japan, Tanjiro Kamado is a kindhearted boy who makes a living selling charcoal. But his peaceful life is shattered when a demon slaughters his entire family. His little sister Nezuko is the only survivor, but she has been transformed into a demon herself! Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    },
    3: {
        id: "3",
        title: "My Hero Academia",
        coverImage: "https://via.placeholder.com/300x450",
        author: "Kohei Horikoshi",
        artist: "Kohei Horikoshi",
        status: "Ongoing",
        releaseYear: "2014",
        genres: ["Action", "Adventure", "Comedy", "Superhero"],
        rating: "4.8",
        description:
            "In a world where people with superpowers (known as 'Quirks') are the norm, Izuku Midoriya has dreams of becoming a hero despite being bullied for not having a Quirk. After meeting his personal hero, All Might, Midoriya is scouted to become his successor and later joins U.A. High School, a prestigious high school for heroes in training.",
    },
    4: {
        id: "4",
        title: "Jujutsu Kaisen",
        coverImage: "https://via.placeholder.com/300x450",
        author: "Gege Akutami",
        artist: "Gege Akutami",
        status: "Ongoing",
        releaseYear: "2018",
        genres: ["Action", "Horror", "Supernatural"],
        rating: "4.7",
        description:
            "Yuji Itadori is an unnaturally fit high school student living a normal life. But when he consumes a cursed object to save his friends, he finds himself sharing his body with a powerful curse named Ryomen Sukuna. Guided by the most powerful jujutsu sorcerer, Satoru Gojo, Itadori is admitted to Tokyo Jujutsu High School, an organization that fights the curses.",
    },
    5: {
        id: "5",
        title: "Chainsaw Man",
        coverImage: "https://via.placeholder.com/300x450",
        author: "Tatsuki Fujimoto",
        artist: "Tatsuki Fujimoto",
        status: "Ongoing",
        releaseYear: "2018",
        genres: ["Action", "Horror", "Comedy", "Dark Fantasy"],
        rating: "4.9",
        description:
            "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita. One day, Denji is betrayed and killed. As his consciousness fades, he makes a contract with Pochita and gets revived as 'Chainsaw Man' — a man with a devil's heart.",
    },
};

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
];

const MangaDetailsScreen = ({ route, navigation }) => {
    const { id, title } = route.params;
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState("chapters");

    const dispatch = useDispatch();
    const { details, chapters, loading, error, bookmarks, downloads } = useSelector((state) => state.manga);
    const theme = useSelector((state) => state.settings.theme);

    // Get the correct mock data based on ID
    const mockData = mangaDetailsMap[id] || mockMangaDetails;

    // Use mock data instead of fetching from API
    const mangaDetails = mockData;
    const mangaChapters = mockChapters;

    // Check if manga is bookmarked or downloaded
    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === id);
    const isDownloaded = downloads.some((download) => download.id === id);

    useEffect(() => {
        // Set the title in the header
        navigation.setOptions({
            title: title || "Manga Details",
        });
    }, [navigation, title]);

    const handleBookmark = () => {
        if (isBookmarked) {
            dispatch(removeBookmark(id));
        } else {
            dispatch(addBookmark(mangaDetails));
        }
    };

    const handleDownload = () => {
        if (isDownloaded) {
            dispatch(removeDownload(id));
        } else {
            dispatch(addDownload(mangaDetails));
        }
    };

    const handleReadChapter = (chapter) => {
        navigation.navigate("Reader", {
            mangaId: id,
            chapterId: chapter.id,
            mangaTitle: mangaDetails.title,
            chapterNumber: chapter.number,
        });
    };

    const renderGenres = () => (
        <View style={styles.genresContainer}>
            {mangaDetails.genres.map((genre, index) => (
                <View
                    key={index}
                    style={styles.genreTag}
                >
                    <Text style={styles.genreText}>{genre}</Text>
                </View>
            ))}
        </View>
    );

    const renderMangaInfo = () => (
        <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Author:</Text>
                <Text style={styles.infoValue}>{mangaDetails.author}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Artist:</Text>
                <Text style={styles.infoValue}>{mangaDetails.artist}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{mangaDetails.status}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Release:</Text>
                <Text style={styles.infoValue}>{mangaDetails.releaseYear}</Text>
            </View>
        </View>
    );

    const renderChapters = () => (
        <View style={styles.chaptersContainer}>
            {mangaChapters.map((chapter, index) => (
                <TouchableOpacity
                    key={chapter.id}
                    style={styles.chapterItem}
                    onPress={() => handleReadChapter(chapter)}
                >
                    <View>
                        <Text style={styles.chapterTitle}>{chapter.title}</Text>
                        <Text style={styles.chapterDate}>{chapter.date}</Text>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#BDBDBD"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#007AFF"
                    />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: mangaDetails.coverImage }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />
                        <View style={styles.headerOverlay} />
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.detailsContainer}>
                            <Image
                                source={{ uri: mangaDetails.coverImage }}
                                style={styles.thumbnail}
                                resizeMode="cover"
                            />

                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{mangaDetails.title}</Text>
                                <View style={styles.ratingContainer}>
                                    <Ionicons
                                        name="star"
                                        size={16}
                                        color="#FFD700"
                                    />
                                    <Text style={styles.ratingText}>{mangaDetails.rating}</Text>
                                </View>

                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleBookmark}
                                    >
                                        <Ionicons
                                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                            size={24}
                                            color={isBookmarked ? "#F50057" : "#424242"}
                                        />
                                        <Text style={styles.actionText}>{isBookmarked ? "Bookmarked" : "Bookmark"}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={handleDownload}
                                    >
                                        <Ionicons
                                            name={isDownloaded ? "cloud-done" : "cloud-download-outline"}
                                            size={24}
                                            color={isDownloaded ? "#007AFF" : "#424242"}
                                        />
                                        <Text style={styles.actionText}>{isDownloaded ? "Downloaded" : "Download"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {renderGenres()}

                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionTitle}>Description</Text>
                            <Text
                                style={styles.descriptionText}
                                numberOfLines={showFullDescription ? undefined : 3}
                            >
                                {mangaDetails.description}
                            </Text>
                            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                                <Text style={styles.readMoreText}>{showFullDescription ? "Show Less" : "Read More"}</Text>
                            </TouchableOpacity>
                        </View>

                        {renderMangaInfo()}

                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === "chapters" && styles.activeTab]}
                                onPress={() => setActiveTab("chapters")}
                            >
                                <Text style={[styles.tabText, activeTab === "chapters" && styles.activeTabText]}>Chapters</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tab, activeTab === "related" && styles.activeTab]}
                                onPress={() => setActiveTab("related")}
                            >
                                <Text style={[styles.tabText, activeTab === "related" && styles.activeTabText]}>Related</Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === "chapters" ? (
                            renderChapters()
                        ) : (
                            <View style={styles.relatedContainer}>
                                <Text style={styles.comingSoonText}>Coming Soon</Text>
                            </View>
                        )}
                    </View>
                </>
            )}
        </ScrollView>
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
        height: 400,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 400,
    },
    errorText: {
        color: "#F50057",
        fontSize: 16,
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
    contentContainer: {
        backgroundColor: "#1E1E1E",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    detailsContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    thumbnail: {
        width: 110,
        height: 160,
        borderRadius: 8,
        marginTop: -70,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    titleContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "flex-start",
        paddingTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        fontSize: 12,
        color: "#BDBDBD",
        marginTop: 4,
    },
    genresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 16,
    },
    genreTag: {
        backgroundColor: "#333333",
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    genreText: {
        fontSize: 12,
        color: "#BDBDBD",
    },
    descriptionContainer: {
        marginBottom: 16,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: "#BDBDBD",
        lineHeight: 20,
    },
    readMoreText: {
        color: "#007AFF",
        fontSize: 14,
        marginTop: 4,
    },
    infoContainer: {
        backgroundColor: "#333333",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    infoLabel: {
        width: 80,
        fontSize: 14,
        color: "#BDBDBD",
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "500",
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        borderBottomWidth: 1,
        borderColor: "#333333",
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#007AFF",
    },
    tabText: {
        fontSize: 16,
        color: "#BDBDBD",
    },
    activeTabText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    chaptersContainer: {
        marginTop: 16,
    },
    chapterItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#333333",
    },
    chapterTitle: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    chapterDate: {
        fontSize: 12,
        color: "#BDBDBD",
        marginTop: 4,
    },
    relatedContainer: {
        marginTop: 16,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    comingSoonText: {
        fontSize: 16,
        color: "#BDBDBD",
    },
});

export default MangaDetailsScreen;
