import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

// Components
import MangaCard from "../../components/common/MangaCard";

// Actions
import { searchManga } from "../../services/actions/mangaActions";

// Mock data for genres
const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life"];

// Mock data for popular searches
const popularSearches = ["One Piece", "Demon Slayer", "Jujutsu Kaisen", "My Hero Academia", "Tokyo Revengers"];

// Mock search results (normally would come from Redux)
const mockSearchResults = [
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

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const dispatch = useDispatch();
    const { searchResults, loading, error } = useSelector((state) => state.manga);

    useEffect(() => {
        if (searchQuery) {
            const delayDebounce = setTimeout(() => {
                handleSearch();
            }, 500);

            return () => clearTimeout(delayDebounce);
        }
    }, [searchQuery]);

    const handleSearch = () => {
        if (searchQuery.trim().length > 0) {
            dispatch(searchManga(searchQuery));

            // Add to recent searches if not already there
            if (!recentSearches.includes(searchQuery) && searchQuery.trim() !== "") {
                setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
            }
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handlePopularSearch = (query) => {
        setSearchQuery(query);
    };

    const handleGenreSelect = (genre) => {
        navigation.navigate("MangaDetails", { genreFilter: genre });
    };

    const renderMangaItem = ({ item }) => (
        <View style={styles.resultItem}>
            <MangaCard manga={item} />
        </View>
    );

    const renderSearchSuggestions = () => (
        <View style={styles.suggestionsContainer}>
            {recentSearches.length > 0 && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <View style={styles.chipsContainer}>
                        {recentSearches.map((search, index) => (
                            <TouchableOpacity
                                key={`recent-${index}`}
                                style={styles.chip}
                                onPress={() => handlePopularSearch(search)}
                            >
                                <Text style={styles.chipText}>{search}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Popular Searches</Text>
                <View style={styles.chipsContainer}>
                    {popularSearches.map((search, index) => (
                        <TouchableOpacity
                            key={`popular-${index}`}
                            style={styles.chip}
                            onPress={() => handlePopularSearch(search)}
                        >
                            <Text style={styles.chipText}>{search}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Browse by Genre</Text>
                <View style={styles.chipsContainer}>
                    {genres.map((genre, index) => (
                        <TouchableOpacity
                            key={`genre-${index}`}
                            style={styles.chip}
                            onPress={() => handleGenreSelect(genre)}
                        >
                            <Text style={styles.chipText}>{genre}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color="#757575"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for manga or authors"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch}>
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="#757575"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#6C63FF"
                    />
                </View>
            ) : searchQuery.length > 0 ? (
                <FlatList
                    data={searchResults.length > 0 ? searchResults : mockSearchResults}
                    renderItem={renderMangaItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.resultsContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
                        </View>
                    }
                />
            ) : (
                renderSearchSuggestions()
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: "100%",
        fontSize: 16,
        color: "#212121",
    },
    suggestionsContainer: {
        flex: 1,
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#212121",
        marginBottom: 12,
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    chipText: {
        fontSize: 14,
        color: "#757575",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    resultsContainer: {
        padding: 16,
    },
    resultItem: {
        flex: 1,
        margin: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        marginTop: 32,
    },
    emptyText: {
        fontSize: 16,
        color: "#757575",
        textAlign: "center",
    },
});

export default SearchScreen;
