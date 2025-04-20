import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    Button,
    ActivityIndicator,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ToastAndroid,
    Platform,
    PermissionsAndroid,
    Share,
    StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { mangaAPI } from "../services/api";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const ChapterScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { chapterId, mangaId, chapterTitle } = route.params;
    const [chapterImages, setChapterImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentChapterId, setCurrentChapterId] = useState(chapterId);
    const [currentTitle, setCurrentTitle] = useState(chapterTitle);
    const [totalPages, setTotalPages] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [hasPermission, setHasPermission] = useState(false);
    const [debugLog, setDebugLog] = useState([]);
    const [uiVisible, setUiVisible] = useState(true);

    // Toggle UI visibility when screen is tapped
    const toggleUI = () => {
        setUiVisible((prev) => !prev);
    };

    // Set up screen focus effect to handle UI hiding
    useFocusEffect(
        React.useCallback(() => {
            // Hide status bar when screen is focused
            StatusBar.setHidden(true, "fade");

            // Android: Set navigation to immersive mode
            if (Platform.OS === "android") {
                try {
                    // This would be where native module calls would go to set immersive mode
                    // Using Expo, we rely on StatusBar.setHidden() since direct immersive mode
                    // requires native modules
                    addDebugLog("Setting immersive mode");
                } catch (error) {
                    addDebugLog(`Error setting immersive mode: ${error.message}`);
                }
            }

            return () => {
                // Show status bar when screen loses focus
                StatusBar.setHidden(false, "fade");
            };
        }, [])
    );

    // Add to debug log
    const addDebugLog = (message) => {
        console.log(message);
        setDebugLog((prevLogs) => [...prevLogs, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
    };

    const fetchChapterImages = async (id) => {
        try {
            setLoading(true);
            addDebugLog(`Fetching images for chapter ${id}`);

            const response = await fetch(`https://api-consumet-org-chi.vercel.app/manga/mangadex/read?chapterId=${id}`);
            const data = await response.json();
            const images = data.images || [];

            addDebugLog(`Received ${images.length} images`);
            setChapterImages(images);
            setTotalPages(images.length);
        } catch (error) {
            addDebugLog(`Error fetching images: ${error.message}`);
            Alert.alert("Error", "Failed to load chapter images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapterImages(currentChapterId);

        // Request permissions when component mounts
        (async () => {
            try {
                addDebugLog("Requesting permissions");

                if (Platform.OS === "android") {
                    const permissions = [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];

                    const granted = await PermissionsAndroid.requestMultiple(permissions);

                    if (
                        granted["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted["android.permission.READ_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED
                    ) {
                        setHasPermission(true);
                        addDebugLog("Android permissions granted");
                    } else {
                        addDebugLog("Android storage permissions denied");
                    }
                } else {
                    // iOS uses different permissions model via expo-media-library
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    setHasPermission(status === "granted");
                    addDebugLog(`iOS permission status: ${status}`);
                }
            } catch (err) {
                addDebugLog(`Error requesting permissions: ${err.message}`);
            }
        })();
    }, [currentChapterId]);

    const goToChapter = (next) => {
        const currentNum = parseFloat(currentChapterId);
        const nextId = next ? (currentNum + 0.1).toFixed(1) : (currentNum - 0.1).toFixed(1);

        setCurrentChapterId(nextId);
        setCurrentTitle(`Chapter ${nextId}`);
        scrollToTop();
    };

    const scrollToTop = () => {
        // For future: you can attach ref to ScrollView to scroll to top
    };

    // Show a notification to the user
    const showNotification = (message) => {
        addDebugLog(message);
        if (Platform.OS === "android") {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert("Notification", message);
        }
    };

    // Simple image download using fetch API
    const simpleImageDownload = async (imageUrl, fileName) => {
        try {
            addDebugLog(`Fetching image using simple method: ${fileName}`);

            // Download image data
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();

            addDebugLog(`Got blob for ${fileName}, size: ${imageBlob.size} bytes`);

            // Convert blob to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    addDebugLog(`Converted ${fileName} to base64`);
                    resolve(reader.result);
                };
                reader.onerror = (error) => {
                    addDebugLog(`Error converting ${fileName} to base64: ${error}`);
                    reject(error);
                };
                reader.readAsDataURL(imageBlob);
            });
        } catch (error) {
            addDebugLog(`Failed to download image: ${fileName}, error: ${error.message}`);
            return null;
        }
    };

    // Method to share a debug log
    const shareDebugLog = async () => {
        try {
            const logText = debugLog.join("\n");
            await Share.share({
                message: `Debug log for chapter download:\n${logText}`,
                title: "MangaReader Debug Log",
            });
        } catch (error) {
            console.error("Error sharing debug log:", error);
        }
    };

    // Download single image and save to file
    const downloadSingleImage = async (imageUrl, fileName, localDir) => {
        addDebugLog(`Downloading image: ${fileName}`);

        // Full path where the file will be saved
        const localFilePath = `${localDir}${fileName}`;

        try {
            // Try direct download first
            addDebugLog(`Trying direct download for ${fileName}`);

            try {
                const { uri } = await FileSystem.downloadAsync(imageUrl, localFilePath);
                addDebugLog(`Direct download successful: ${uri}`);
                return uri;
            } catch (directDownloadError) {
                addDebugLog(`Direct download failed: ${directDownloadError.message}`);

                // Try fetch API as fallback
                addDebugLog(`Trying fetch API download for ${fileName}`);
                const response = await fetch(imageUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Get image data as blob
                const blob = await response.blob();
                addDebugLog(`Got blob of size: ${blob.size} bytes`);

                // Convert blob to base64
                const reader = new FileReader();
                const base64Data = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                // Remove the data URL prefix to get just the base64 string
                const base64 = base64Data.split(",")[1];
                addDebugLog(`Writing base64 data to file: ${localFilePath}`);

                // Write the base64 data to a file
                await FileSystem.writeAsStringAsync(localFilePath, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                addDebugLog(`File written successfully: ${localFilePath}`);
                return localFilePath;
            }
        } catch (error) {
            addDebugLog(`All download methods failed for ${fileName}: ${error.message}`);
            return null;
        }
    };

    // Download chapter images
    const downloadChapter = async () => {
        if (chapterImages.length === 0) {
            Alert.alert("Error", "No images to download");
            return;
        }

        if (!hasPermission) {
            Alert.alert("Permission Required", "Storage permission is required to download images", [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Grant Permission",
                    onPress: async () => {
                        if (Platform.OS === "android") {
                            try {
                                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    setHasPermission(true);
                                    downloadChapter();
                                }
                            } catch (err) {
                                addDebugLog(`Permission request error: ${err.message}`);
                            }
                        } else {
                            const { status } = await MediaLibrary.requestPermissionsAsync();
                            if (status === "granted") {
                                setHasPermission(true);
                                downloadChapter();
                            }
                        }
                    },
                },
            ]);
            return;
        }

        try {
            setDownloading(true);
            setDownloadProgress(0);

            // Create directory for downloads
            const dirName = `${mangaId}_${currentChapterId}_${Date.now()}`;
            const dirPath = `${FileSystem.documentDirectory}${dirName}/`;

            addDebugLog(`Creating directory: ${dirPath}`);

            // Ensure the directory exists
            await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
            addDebugLog(`Directory created: ${dirPath}`);

            // Download each image
            let downloadedCount = 0;
            const downloadedFiles = [];

            for (let i = 0; i < chapterImages.length; i++) {
                // Update progress
                setDownloadProgress(i / chapterImages.length);

                const imageUrl = chapterImages[i];
                const fileName = `page_${(i + 1).toString().padStart(3, "0")}.jpg`;

                try {
                    // Download the image
                    const filePath = await downloadSingleImage(imageUrl, fileName, dirPath);

                    if (filePath) {
                        downloadedFiles.push(filePath);
                        downloadedCount++;
                        addDebugLog(`Downloaded ${downloadedCount}/${chapterImages.length}`);
                    }
                } catch (error) {
                    addDebugLog(`Error downloading image ${i + 1}: ${error.message}`);
                }
            }

            setDownloadProgress(1);

            if (downloadedCount > 0) {
                // Try saving to media library (requires permission)
                try {
                    addDebugLog(`Saving to media library: ${downloadedCount} files`);

                    if (Platform.OS === "ios") {
                        // On iOS, save each file individually
                        for (const filePath of downloadedFiles) {
                            const asset = await MediaLibrary.createAssetAsync(filePath);
                            addDebugLog(`Created asset: ${asset.uri}`);
                        }
                    } else {
                        // On Android, save first file and create album
                        const firstAsset = await MediaLibrary.createAssetAsync(downloadedFiles[0]);
                        addDebugLog(`Created first asset: ${firstAsset.uri}`);

                        const albumName = `Manga ${mangaId} ${currentTitle}`;
                        const album = await MediaLibrary.createAlbumAsync(albumName, firstAsset, false);
                        addDebugLog(`Created album: ${albumName}`);

                        // Add remaining files to album
                        if (downloadedFiles.length > 1) {
                            const assetsToAdd = [];
                            for (let i = 1; i < downloadedFiles.length; i++) {
                                const asset = await MediaLibrary.createAssetAsync(downloadedFiles[i]);
                                assetsToAdd.push(asset);
                            }

                            if (assetsToAdd.length > 0) {
                                await MediaLibrary.addAssetsToAlbumAsync(assetsToAdd, album, false);
                                addDebugLog(`Added ${assetsToAdd.length} assets to album`);
                            }
                        }
                    }

                    showNotification(`Saved ${downloadedCount} images to gallery!`);
                } catch (mediaError) {
                    addDebugLog(`Error saving to media library: ${mediaError.message}`);

                    // If media library fails, offer to share the folder
                    try {
                        if (await Sharing.isAvailableAsync()) {
                            addDebugLog(`Sharing directory: ${dirPath}`);
                            await Sharing.shareAsync(dirPath);
                        } else {
                            showNotification(`Downloaded ${downloadedCount} images to: ${dirPath}`);
                        }
                    } catch (shareError) {
                        addDebugLog(`Error sharing: ${shareError.message}`);
                        showNotification(`Downloaded ${downloadedCount}/${chapterImages.length} images`);
                    }
                }
            } else {
                addDebugLog("No images were downloaded successfully");
                Alert.alert("Download Failed", "Could not download any images");
            }
        } catch (error) {
            addDebugLog(`Download error: ${error.message}`);
            Alert.alert("Download Failed", "There was an error downloading the chapter");
        } finally {
            setDownloading(false);
            setDownloadProgress(0);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.fullscreenTouchable}
                activeOpacity={1}
                onPress={toggleUI}
            >
                {uiVisible && (
                    <SafeAreaView style={styles.header}>
                        <Text style={styles.title}>{currentTitle}</Text>

                        <View style={styles.actionsRow}>
                            <View style={styles.buttonRow}>
                                <Button
                                    title="Previous"
                                    onPress={() => goToChapter(false)}
                                />
                                <Button
                                    title="Next"
                                    onPress={() => goToChapter(true)}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.downloadButton, downloading ? styles.downloadingButton : {}]}
                                onPress={downloadChapter}
                                disabled={downloading || loading}
                            >
                                <Ionicons
                                    name={downloading ? "cloud-download-outline" : "cloud-download"}
                                    size={20}
                                    color="white"
                                />
                                <Text style={styles.downloadButtonText}>{downloading ? `${Math.round(downloadProgress * 100)}%` : "Download"}</Text>
                            </TouchableOpacity>

                            {debugLog.length > 0 && (
                                <TouchableOpacity
                                    style={styles.debugButton}
                                    onPress={shareDebugLog}
                                >
                                    <Ionicons
                                        name="bug-outline"
                                        size={20}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </SafeAreaView>
                )}

                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator
                            size="large"
                            color="#0000ff"
                        />
                    </View>
                ) : chapterImages.length > 0 ? (
                    <ScrollView>
                        {chapterImages.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={styles.image}
                                resizeMode="contain"
                                onError={() => console.log("Image load failed", img)}
                            />
                        ))}
                        {uiVisible && <Text style={styles.pageInfo}>Total Pages: {totalPages}</Text>}
                    </ScrollView>
                ) : (
                    <View style={styles.centered}>
                        <Text>No images available</Text>
                    </View>
                )}

                {uiVisible && (
                    <View style={styles.navigationControls}>
                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => goToChapter(false)}
                        >
                            <Ionicons
                                name="chevron-back-circle"
                                size={40}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.navButton}
                            onPress={() => goToChapter(true)}
                        >
                            <Ionicons
                                name="chevron-forward-circle"
                                size={40}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ChapterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    fullscreenTouchable: {
        flex: 1,
        position: "relative",
    },
    header: {
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        position: "absolute",
        width: "100%",
        top: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
    },
    actionsRow: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 0,
    },
    image: {
        width: "100%",
        height: 500,
        marginBottom: 10,
    },
    pageInfo: {
        textAlign: "center",
        fontSize: 16,
        padding: 10,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.7)",
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    downloadButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    downloadingButton: {
        backgroundColor: "#28a745",
    },
    downloadButtonText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
    },
    debugButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navigationControls: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        zIndex: 10,
    },
    navButton: {
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 25,
    },
});
