import axios from "axios";

// MangaDex API base URL
const MANGADEX_API_URL = process.env.EXPO_PUBLIC_MANGADEX_BASE_URL || "https://api.mangadex.org";

// Local backend API URL
const LOCAL_API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance for MangaDex API
const mangadexApi = axios.create({
    baseURL: MANGADEX_API_URL,
    timeout: 60000, // Increased timeout to 60 seconds for slow connections
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "MangaVaani/1.0",
    },
});

// Create axios instance for local backend API
const localBackendApi = axios.create({
    baseURL: LOCAL_API_URL,
    timeout: 60000, // Increased timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor with retry logic
let retryCount = 0;
const MAX_RETRIES = 5; // Increased from 3 to 5

mangadexApi.interceptors.request.use(
    (config) => {
        // Log request
        console.log(`Making request to: ${config.baseURL}${config.url}`);

        // Add retry config
        config.retry = MAX_RETRIES;
        config.retryDelay = 1000;

        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor with retry logic
mangadexApi.interceptors.response.use(
    (response) => {
        // Reset retry count on success
        retryCount = 0;
        console.log(`Received response from: ${response.config.url} - Status: ${response.status}`);
        return response;
    },
    async (error) => {
        const config = error.config;

        // If we've configured this request for retry
        if (config && retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying request (${retryCount}/${MAX_RETRIES}): ${config.url}`);

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Retry the request
            return mangadexApi(config);
        }

        // Log detailed error information
        console.error(`API Error: ${error.message}`);
        if (error.response) {
            console.log(`Status: ${error.response.status} - Data:`, error.response.data);
        }

        return Promise.reject(error);
    }
);

// Fallback data when network fails
const FALLBACK_DATA = {
    mangaList: [
        {
            id: "fallback-1",
            title: "One Piece",
            image: "https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg",
            description:
                "The story follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit.",
            status: "ongoing",
            year: "1999",
            author: "Eiichiro Oda",
            rating: "4.9",
            tags: ["Action", "Adventure", "Fantasy", "Shonen"],
        },
        {
            id: "fallback-2",
            title: "Demon Slayer",
            image: "https://upload.wikimedia.org/wikipedia/en/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg",
            description: "The story follows Tanjiro Kamado and his sister Nezuko Kamado as they seek a cure to Nezuko's demon curse.",
            status: "completed",
            year: "2016",
            author: "Koyoharu Gotouge",
            rating: "4.8",
            tags: ["Action", "Supernatural", "Historical", "Shonen"],
        },
        {
            id: "fallback-3",
            title: "Jujutsu Kaisen",
            image: "https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen.jpg",
            description: "The story follows high school student Yuji Itadori as he joins a secret organization of Jujutsu Sorcerers.",
            status: "ongoing",
            year: "2018",
            author: "Gege Akutami",
            rating: "4.7",
            tags: ["Action", "Supernatural", "Horror", "Shonen"],
        },
        {
            id: "fallback-4",
            title: "My Hero Academia",
            image: "https://upload.wikimedia.org/wikipedia/en/5/5a/Boku_no_Hero_Academia_Volume_1.png",
            description: "In a world where most people have superpowers, a boy without them dreams of becoming a superhero himself.",
            status: "ongoing",
            year: "2014",
            author: "Kohei Horikoshi",
            rating: "4.6",
            tags: ["Action", "Superhero", "School", "Shonen"],
        },
        {
            id: "fallback-5",
            title: "Attack on Titan",
            image: "https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg",
            description:
                "The story follows Eren Yeager, who vows to exterminate the Titans after a Titan brings about the destruction of his hometown and the death of his mother.",
            status: "completed",
            year: "2009",
            author: "Hajime Isayama",
            rating: "4.8",
            tags: ["Action", "Dark Fantasy", "Post-Apocalyptic", "Seinen"],
        },
        {
            id: "fallback-6",
            title: "Chainsaw Man",
            image: "https://upload.wikimedia.org/wikipedia/en/2/24/Chainsawman.jpg",
            description:
                "The story follows Denji, an impoverished young man who makes a contract with a dog-like devil named Pochita, fusing with him to become the titular Chainsaw Man.",
            status: "ongoing",
            year: "2018",
            author: "Tatsuki Fujimoto",
            rating: "4.7",
            tags: ["Action", "Dark Fantasy", "Horror", "Shonen"],
        },
        {
            id: "fallback-7",
            title: "Spy × Family",
            image: "https://upload.wikimedia.org/wikipedia/en/5/59/Spy_x_Family_Vol_1.jpg",
            description:
                "The story follows a spy who has to build a family to execute a mission, not realizing that the girl he adopts as his daughter is a telepath, and the woman he agrees to be in a marriage with is a skilled assassin.",
            status: "ongoing",
            year: "2019",
            author: "Tatsuya Endo",
            rating: "4.8",
            tags: ["Action", "Comedy", "Spy", "Shonen"],
        },
        {
            id: "fallback-8",
            title: "Tokyo Ghoul",
            image: "https://upload.wikimedia.org/wikipedia/en/3/31/Tokyo_Ghoul_volume_1_cover.jpg",
            description:
                "The story follows Ken Kaneki, a college student who barely survives a deadly encounter with Rize Kamishiro, his date who reveals herself as a ghoul.",
            status: "completed",
            year: "2011",
            author: "Sui Ishida",
            rating: "4.5",
            tags: ["Action", "Dark Fantasy", "Horror", "Seinen"],
        },
    ],
    chapterList: {
        "fallback-1": [
            { id: "chapter-1-1", title: "Romance Dawn", number: "1", date: "2020-01-01" },
            { id: "chapter-1-2", title: "They Call Him Luffy", number: "2", date: "2020-01-08" },
            { id: "chapter-1-3", title: "Enter Zoro", number: "3", date: "2020-01-15" },
            { id: "chapter-1-4", title: "Morgan vs. Luffy", number: "4", date: "2020-01-22" },
            { id: "chapter-1-5", title: "Pirate King", number: "5", date: "2020-01-29" },
        ],
        "fallback-2": [
            { id: "chapter-2-1", title: "Cruelty", number: "1", date: "2019-01-01" },
            { id: "chapter-2-2", title: "The Stranger", number: "2", date: "2019-01-08" },
            { id: "chapter-2-3", title: "Return to Mt. Sagiri", number: "3", date: "2019-01-15" },
            { id: "chapter-2-4", title: "Kidnapper's Bog", number: "4", date: "2019-01-22" },
            { id: "chapter-2-5", title: "Final Selection", number: "5", date: "2019-01-29" },
        ],
        "fallback-3": [
            { id: "chapter-3-1", title: "Ryomen Sukuna", number: "1", date: "2018-01-01" },
            { id: "chapter-3-2", title: "For Myself", number: "2", date: "2018-01-08" },
            { id: "chapter-3-3", title: "Girl of Steel", number: "3", date: "2018-01-15" },
            { id: "chapter-3-4", title: "The Fearsome Womb", number: "4", date: "2018-01-22" },
            { id: "chapter-3-5", title: "Jujutsu Sorcerer", number: "5", date: "2018-01-29" },
        ],
    },
    chapterPages: {
        "chapter-1-1": [
            "https://placehold.co/800x1200?text=One+Piece+Ch1+Page1",
            "https://placehold.co/800x1200?text=One+Piece+Ch1+Page2",
            "https://placehold.co/800x1200?text=One+Piece+Ch1+Page3",
            "https://placehold.co/800x1200?text=One+Piece+Ch1+Page4",
            "https://placehold.co/800x1200?text=One+Piece+Ch1+Page5",
        ],
        "chapter-2-1": [
            "https://placehold.co/800x1200?text=Demon+Slayer+Ch1+Page1",
            "https://placehold.co/800x1200?text=Demon+Slayer+Ch1+Page2",
            "https://placehold.co/800x1200?text=Demon+Slayer+Ch1+Page3",
            "https://placehold.co/800x1200?text=Demon+Slayer+Ch1+Page4",
            "https://placehold.co/800x1200?text=Demon+Slayer+Ch1+Page5",
        ],
        "chapter-3-1": [
            "https://placehold.co/800x1200?text=Jujutsu+Kaisen+Ch1+Page1",
            "https://placehold.co/800x1200?text=Jujutsu+Kaisen+Ch1+Page2",
            "https://placehold.co/800x1200?text=Jujutsu+Kaisen+Ch1+Page3",
            "https://placehold.co/800x1200?text=Jujutsu+Kaisen+Ch1+Page4",
            "https://placehold.co/800x1200?text=Jujutsu+Kaisen+Ch1+Page5",
        ],
    },
};

// API endpoints
export const mangaAPI = {
    // Get manga list (popular, trending, etc.)
    getMangaList: async (params = {}) => {
        try {
            const queryParams = {
                limit: 12,
                includes: ["cover_art"],
                contentRating: ["safe", "suggestive"],
                hasAvailableChapters: true,
            };

            // Handle different types of manga lists
            if (params && params.type) {
                switch (params.type) {
                    case "popular":
                        queryParams.order = { followedCount: "desc" };
                        break;
                    case "recent":
                        queryParams.order = { latestUploadedChapter: "desc" };
                        break;
                    case "trending":
                        queryParams.order = { rating: "desc" };
                        break;
                    default:
                        break;
                }
            }

            try {
                const response = await mangadexApi.get("/manga", { params: queryParams });

                // Ensure each manga result has a cover art relationship
                // If not, we'll use a placeholder image
                if (response.data && response.data.data) {
                    response.data.data = response.data.data.map((manga) => {
                        // Check if manga has cover art
                        const hasCoverArt =
                            manga.relationships &&
                            manga.relationships.some((rel) => rel.type === "cover_art" && rel.attributes && rel.attributes.fileName);

                        if (!hasCoverArt) {
                            // Add a dummy cover relationship for manga without covers
                            console.log(`Adding placeholder cover for manga: ${manga.id}`);
                            manga.relationships = manga.relationships || [];
                            manga.relationships.push({
                                type: "cover_art",
                                attributes: {
                                    fileName: `placeholder-${manga.id}.jpg`,
                                    description: "Placeholder cover",
                                },
                            });
                        }

                        return manga;
                    });
                }

                return response;
            } catch (error) {
                console.log("Network error, using fallback data for manga list");
                // Return a fake response with fallback data
                return {
                    data: {
                        data: FALLBACK_DATA.mangaList.map((manga) => ({
                            id: manga.id,
                            attributes: {
                                title: { en: manga.title },
                                description: { en: manga.description },
                                status: manga.status,
                                year: manga.year,
                            },
                            relationships: [
                                {
                                    type: "cover_art",
                                    attributes: {
                                        fileName: manga.id + ".jpg",
                                    },
                                },
                            ],
                        })),
                    },
                };
            }
        } catch (error) {
            console.error("Error in getMangaList:", error);
            return Promise.reject(error);
        }
    },

    // Get manga details by ID
    getMangaDetails: async (id) => {
        try {
            try {
                const response = await mangadexApi.get(`/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`);
                return response;
            } catch (error) {
                console.log("Network error, using fallback data for manga details");
                // Find fallback manga by ID
                const manga = FALLBACK_DATA.mangaList.find((m) => m.id === id) || FALLBACK_DATA.mangaList[0];

                // Return a fake response with fallback data
                return {
                    data: {
                        data: {
                            id: manga.id,
                            attributes: {
                                title: { en: manga.title },
                                description: { en: manga.description },
                                status: manga.status,
                                year: manga.year,
                                tags:
                                    manga.tags?.map((tag) => ({
                                        attributes: { name: { en: tag } },
                                    })) || [],
                            },
                            relationships: [
                                // Add cover art relationship
                                {
                                    type: "cover_art",
                                    attributes: {
                                        fileName: manga.id + ".jpg",
                                    },
                                },
                                // Add author relationship
                                {
                                    type: "author",
                                    attributes: {
                                        name: manga.author || "Unknown Author",
                                    },
                                },
                                // Add artist relationship (same as author for fallback)
                                {
                                    type: "artist",
                                    attributes: {
                                        name: manga.author || "Unknown Artist",
                                    },
                                },
                            ],
                        },
                        statistics: {
                            [manga.id]: {
                                follows: 10000,
                                rating: { average: parseFloat(manga.rating) || 4.5 },
                            },
                        },
                    },
                };
            }
        } catch (error) {
            console.error("Error in getMangaDetails:", error);
            return Promise.reject(error);
        }
    },

    // Get manga chapters
    getMangaChapters: async (mangaId) => {
        try {
            try {
                const response = await mangadexApi.get(`/manga/${mangaId}/feed`, {
                    params: {
                        limit: 100,
                        translatedLanguage: ["en"],
                        order: { chapter: "desc" },
                    },
                });
                return response;
            } catch (error) {
                console.log("Network error, using fallback data for chapters");
                // Find fallback chapters by manga ID
                const chapters = FALLBACK_DATA.chapterList[mangaId] || FALLBACK_DATA.chapterList["fallback-1"];

                // Return a fake response with fallback data
                return {
                    data: {
                        data: chapters.map((chapter) => ({
                            id: chapter.id,
                            attributes: {
                                title: chapter.title,
                                chapter: chapter.number,
                                publishAt: chapter.date,
                                translatedLanguage: "en",
                            },
                        })),
                    },
                };
            }
        } catch (error) {
            console.error("Error in getMangaChapters:", error);
            return Promise.reject(error);
        }
    },

    // Get chapter images
    getChapterImages: async (chapterId) => {
        try {
            try {
                const response = await mangadexApi.get(`/at-home/server/${chapterId}`);
                return response;
            } catch (error) {
                console.log("Network error, using fallback data for chapter images");
                // Find fallback pages by chapter ID or generate placeholder pages
                let pages = FALLBACK_DATA.chapterPages[chapterId] || FALLBACK_DATA.chapterPages["chapter-1-1"];

                // Generate more fallback pages if needed (for better user experience)
                if (pages.length < 5) {
                    pages = [];
                    for (let i = 1; i <= 10; i++) {
                        pages.push(`https://placehold.co/800x1200?text=Page+${i}+Placeholder+Image`);
                    }
                }

                // Return a fake response with fallback data
                return {
                    data: {
                        baseUrl: "https://uploads.mangadex.org",
                        chapter: {
                            hash: "fallback-hash",
                            data: pages.map((_, index) => `page${index + 1}.jpg`),
                            dataSaver: pages.map((_, index) => `page${index + 1}.jpg`),
                        },
                    },
                };
            }
        } catch (error) {
            console.error("Error in getChapterImages:", error);
            return Promise.reject(error);
        }
    },

    // Simplified method to get chapter images (alternative approach)
    getChapterImagesSimple: async (chapterId) => {
        try {
            // First, get basic chapter info to get the filenames
            const chapterResponse = await mangadexApi.get(`/chapter/${chapterId}`);
            const chapterData = chapterResponse.data.data;

            if (!chapterData || !chapterData.attributes) {
                throw new Error("Invalid chapter data");
            }

            const hash = chapterData.attributes.hash;
            const fileNames = chapterData.attributes.data || [];

            // Directly construct URLs using MangaDex's direct CDN
            // Note: This might get rate-limited but is simpler
            const imageUrls = fileNames.map((filename) => `https://uploads.mangadex.org/data/${hash}/${filename}`);

            return {
                data: {
                    baseUrl: "https://uploads.mangadex.org",
                    chapter: {
                        hash: hash,
                        data: fileNames,
                        dataSaver: chapterData.attributes.dataSaver || [],
                    },
                    images: imageUrls, // Additionally provide direct URLs
                },
            };
        } catch (error) {
            console.log("Network error, using fallback data for chapter images");

            // Generate fallback pages
            const pages = [];
            for (let i = 1; i <= 10; i++) {
                pages.push(`https://placehold.co/800x1200?text=Page+${i}+Placeholder+Image`);
            }

            return {
                data: {
                    baseUrl: "https://uploads.mangadex.org",
                    chapter: {
                        hash: "fallback-hash",
                        data: pages.map((_, index) => `page${index + 1}.jpg`),
                        dataSaver: pages.map((_, index) => `page${index + 1}.jpg`),
                    },
                    images: pages, // Additionally provide direct placeholder URLs
                },
            };
        }
    },

    // Search manga
    searchManga: async (query) => {
        try {
            try {
                const response = await mangadexApi.get("/manga", {
                    params: {
                        title: query,
                        limit: 20,
                        includes: ["cover_art"],
                        contentRating: ["safe", "suggestive"],
                        order: { relevance: "desc" },
                    },
                });
                return response;
            } catch (error) {
                console.log("Network error, using fallback data for search");
                // Filter fallback manga by title that includes the query
                const results = FALLBACK_DATA.mangaList.filter((manga) => manga.title.toLowerCase().includes(query.toLowerCase()));

                // Return a fake response with fallback data
                return {
                    data: {
                        data: results.map((manga) => ({
                            id: manga.id,
                            attributes: {
                                title: { en: manga.title },
                                description: { en: manga.description },
                            },
                            relationships: [],
                        })),
                    },
                };
            }
        } catch (error) {
            console.error("Error in searchManga:", error);
            return Promise.reject(error);
        }
    },

    // Get manga statistics
    getMangaStatistics: async (mangaId) => {
        try {
            try {
                const response = await mangadexApi.get(`/statistics/manga/${mangaId}`);
                return response;
            } catch (error) {
                console.log("Network error, using fallback data for statistics");
                // Return a fake response with fallback data
                return {
                    data: {
                        statistics: {
                            [mangaId]: {
                                follows: 10000,
                                rating: { average: 4.5 },
                            },
                        },
                    },
                };
            }
        } catch (error) {
            console.error("Error in getMangaStatistics:", error);
            return Promise.reject(error);
        }
    },
};

// Local backend API endpoints
export const localMangaAPI = {
    // Get manga list
    getMangaList: async (params = {}) => {
        try {
            const response = await localBackendApi.get("/manga");
            return response;
        } catch (error) {
            console.error("Error in local getMangaList:", error);
            return Promise.reject(error);
        }
    },

    // Get manga details by ID
    getMangaDetails: async (id) => {
        try {
            const response = await localBackendApi.get(`/manga/${id}`);
            return response;
        } catch (error) {
            console.error("Error in local getMangaDetails:", error);
            return Promise.reject(error);
        }
    },

    // Get manga chapters
    getMangaChapters: async (mangaId) => {
        try {
            const response = await localBackendApi.get(`/manga/${mangaId}/chapters`);
            return response;
        } catch (error) {
            console.error("Error in local getMangaChapters:", error);
            return Promise.reject(error);
        }
    },

    // Get chapter images
    getChapterImages: async (chapterId) => {
        try {
            const response = await localBackendApi.get(`/manga/chapter/${chapterId}/images`);
            return response;
        } catch (error) {
            console.error("Error in local getChapterImages:", error);
            return Promise.reject(error);
        }
    },

    // Search manga
    searchManga: async (query) => {
        try {
            const response = await localBackendApi.get(`/manga/search?q=${query}`);
            return response;
        } catch (error) {
            console.error("Error in local searchManga:", error);
            return Promise.reject(error);
        }
    },

    // Get chapter images with simplified method
    getChapterImagesSimple: async (chapterId) => {
        try {
            const response = await localBackendApi.get(`/manga/chapter/${chapterId}/simple`);
            return response;
        } catch (error) {
            console.error("Error in local getChapterImagesSimple:", error);

            // Generate fallback pages
            const pages = [];
            for (let i = 1; i <= 10; i++) {
                pages.push(`https://placehold.co/800x1200?text=Page+${i}+Placeholder+Image`);
            }

            // Return fallback data
            return {
                data: {
                    images: pages,
                    dataSaverImages: pages,
                    pageCount: pages.length,
                    chapterId: chapterId,
                },
            };
        }
    },
};

export default mangadexApi;
