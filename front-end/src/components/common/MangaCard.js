import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { addBookmark, removeBookmark } from "../../services/actions/mangaActions";

const MangaCard = ({ manga, size = "medium" }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bookmarks = useSelector((state) => state.manga.bookmarks);

    // Check if manga is bookmarked
    const isBookmarked = bookmarks.some((bookmark) => bookmark.id === manga.id);

    // Handle bookmark toggle
    const toggleBookmark = () => {
        if (isBookmarked) {
            dispatch(removeBookmark(manga.id));
        } else {
            dispatch(addBookmark(manga));
        }
    };

    // Navigate to manga details
    const handlePress = () => {
        navigation.navigate("MangaDetails", {
            id: manga.id,
            title: manga.title,
        });
    };

    return (
        <TouchableOpacity
            style={[styles.container, size === "small" && styles.smallContainer, size === "large" && styles.largeContainer]}
            onPress={handlePress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: manga.coverImage || "https://via.placeholder.com/150x200" }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={toggleBookmark}
                >
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isBookmarked ? "#F50057" : "#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <Text
                    style={[styles.title, size === "small" && styles.smallTitle, size === "large" && styles.largeTitle]}
                    numberOfLines={2}
                >
                    {manga.title}
                </Text>
                {size !== "small" && (
                    <Text
                        style={styles.author}
                        numberOfLines={1}
                    >
                        {manga.author || "Unknown Author"}
                    </Text>
                )}
                {size === "large" && (
                    <View style={styles.ratingsContainer}>
                        <Ionicons
                            name="star"
                            size={16}
                            color="#FFD700"
                        />
                        <Text style={styles.rating}>{manga.rating || "0.0"}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        marginRight: 12,
        marginBottom: 16,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    smallContainer: {
        width: 100,
    },
    largeContainer: {
        width: 180,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    bookmarkButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 20,
        padding: 4,
    },
    infoContainer: {
        padding: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#212121",
    },
    smallTitle: {
        fontSize: 12,
    },
    largeTitle: {
        fontSize: 16,
    },
    author: {
        fontSize: 12,
        color: "#757575",
    },
    ratingsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    rating: {
        marginLeft: 4,
        fontSize: 12,
        color: "#212121",
    },
});

export default MangaCard;
