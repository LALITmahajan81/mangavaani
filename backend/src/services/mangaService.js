const axios = require("axios");

// Dummy data for testing
const DUMMY_MANGA_LIST = [
    {
        id: "manga-1",
        title: "One Piece",
        image: "https://via.placeholder.com/200x300?text=OnePiece",
        chapter: "Chapter 1084",
        view: "5.2M",
        description:
            "The story follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit.",
    },
    {
        id: "manga-2",
        title: "Demon Slayer",
        image: "https://via.placeholder.com/200x300?text=DemonSlayer",
        chapter: "Chapter 205",
        view: "3.9M",
        description: "The story follows Tanjiro Kamado and his sister Nezuko Kamado as they seek a cure to Nezuko's demon curse.",
    },
    {
        id: "manga-3",
        title: "Jujutsu Kaisen",
        image: "https://via.placeholder.com/200x300?text=JujutsuKaisen",
        chapter: "Chapter 221",
        view: "2.7M",
        description: "The story follows high school student Yuji Itadori as he joins a secret organization of Jujutsu Sorcerers.",
    },
    {
        id: "manga-4",
        title: "My Hero Academia",
        image: "https://via.placeholder.com/200x300?text=MyHeroAcademia",
        chapter: "Chapter 402",
        view: "3.1M",
        description: "The story follows Izuku Midoriya, who dreams of becoming a superhero in a world where people with superpowers are the norm.",
    },
    {
        id: "manga-5",
        title: "Chainsaw Man",
        image: "https://via.placeholder.com/200x300?text=ChainsawMan",
        chapter: "Chapter 145",
        view: "2.5M",
        description: "The story follows Denji, a young man who merges with his pet devil Pochita to become the Chainsaw Man.",
    },
    {
        id: "manga-6",
        title: "Tokyo Revengers",
        image: "https://via.placeholder.com/200x300?text=TokyoRevengers",
        chapter: "Chapter 278",
        view: "1.9M",
        description:
            "The story follows Takemichi Hanagaki, who travels back in time to save his girlfriend from being killed by the Tokyo Manji Gang.",
    },
];

// Dummy chapters data
const DUMMY_CHAPTERS = {
    "manga-1": [
        { id: "chapter-1-1", title: "Romance Dawn", number: "1" },
        { id: "chapter-1-2", title: "They Call Him Luffy", number: "2" },
        { id: "chapter-1-3", title: "Enter Zoro", number: "3" },
    ],
    "manga-2": [
        { id: "chapter-2-1", title: "Cruelty", number: "1" },
        { id: "chapter-2-2", title: "The Stranger", number: "2" },
        { id: "chapter-2-3", title: "Return to Mt. Sagiri", number: "3" },
    ],
    "manga-3": [
        { id: "chapter-3-1", title: "Ryomen Sukuna", number: "1" },
        { id: "chapter-3-2", title: "For Myself", number: "2" },
        { id: "chapter-3-3", title: "Girl of Steel", number: "3" },
    ],
    "manga-4": [
        { id: "chapter-4-1", title: "Izuku Midoriya: Origin", number: "1" },
        { id: "chapter-4-2", title: "What It Takes to Be a Hero", number: "2" },
        { id: "chapter-4-3", title: "Roaring Muscles", number: "3" },
    ],
    "manga-5": [
        { id: "chapter-5-1", title: "Dog and Chainsaw", number: "1" },
        { id: "chapter-5-2", title: "The Place Where Pochita Is", number: "2" },
        { id: "chapter-5-3", title: "Arrival in Tokyo", number: "3" },
    ],
    "manga-6": [
        { id: "chapter-6-1", title: "Reborn", number: "1" },
        { id: "chapter-6-2", title: "Resist", number: "2" },
        { id: "chapter-6-3", title: "Resolve", number: "3" },
    ],
};

// Dummy chapter images
const DUMMY_CHAPTER_IMAGES = {
    "chapter-1-1": [
        "https://via.placeholder.com/800x1200?text=Page1",
        "https://via.placeholder.com/800x1200?text=Page2",
        "https://via.placeholder.com/800x1200?text=Page3",
    ],
    "chapter-2-1": [
        "https://via.placeholder.com/800x1200?text=DS_Page1",
        "https://via.placeholder.com/800x1200?text=DS_Page2",
        "https://via.placeholder.com/800x1200?text=DS_Page3",
    ],
    "chapter-3-1": [
        "https://via.placeholder.com/800x1200?text=JJK_Page1",
        "https://via.placeholder.com/800x1200?text=JJK_Page2",
        "https://via.placeholder.com/800x1200?text=JJK_Page3",
    ],
    "chapter-4-1": [
        "https://via.placeholder.com/800x1200?text=MHA_Page1",
        "https://via.placeholder.com/800x1200?text=MHA_Page2",
        "https://via.placeholder.com/800x1200?text=MHA_Page3",
    ],
    "chapter-5-1": [
        "https://via.placeholder.com/800x1200?text=CSM_Page1",
        "https://via.placeholder.com/800x1200?text=CSM_Page2",
        "https://via.placeholder.com/800x1200?text=CSM_Page3",
    ],
    "chapter-6-1": [
        "https://via.placeholder.com/800x1200?text=TR_Page1",
        "https://via.placeholder.com/800x1200?text=TR_Page2",
        "https://via.placeholder.com/800x1200?text=TR_Page3",
    ],
};

// Generate more chapter data for each manga
const generateMoreChapters = (mangaId, baseChapters) => {
    const allChapters = [...baseChapters];

    // Generate additional 20 chapters for testing pagination
    for (let i = baseChapters.length + 1; i <= baseChapters.length + 20; i++) {
        allChapters.push({
            id: `${mangaId}-chapter-${i}`,
            title: `Chapter ${i}`,
            number: i.toString(),
            date:
                "2023-" +
                (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0") +
                "-" +
                (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0"),
        });
    }

    return allChapters;
};

// Generate expanded chapter data for all manga
const EXPANDED_CHAPTERS = {};
Object.keys(DUMMY_CHAPTERS).forEach((mangaId) => {
    EXPANDED_CHAPTERS[mangaId] = generateMoreChapters(mangaId, DUMMY_CHAPTERS[mangaId]);
});

// External API simulation for manga chapters
const fetchExternalChapters = async (mangaId) => {
    console.log(`Simulating external API call for manga ID ${mangaId}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Base chapters from our dummy data
    const baseChapters = DUMMY_CHAPTERS[mangaId] || [];

    // Generate a realistic number of chapters based on manga ID
    // This simulates different mangas having different chapter counts
    const mangaIdNum = parseInt(mangaId.replace(/\D/g, "")) || 1;
    const seed = mangaIdNum * 17; // Use the manga ID as a seed for deterministic randomness

    // Calculate chapter count: between 30-120 chapters depending on manga
    const chapterCount = 30 + (seed % 90);

    // Generate all chapters
    const allChapters = [];

    // Popular/long-running mangas have more chapters
    for (let i = 1; i <= chapterCount; i++) {
        // Create chapter with more realistic data
        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() - i * 7); // Weekly release schedule

        let chapterTitle;
        if (i <= baseChapters.length && baseChapters[i - 1].title) {
            // Use base title if available
            chapterTitle = baseChapters[i - 1].title;
        } else {
            // Generate title based on chapter number
            if (i % 10 === 0) {
                // Special title for milestone chapters
                chapterTitle = `Milestone: Chapter ${i}`;
            } else if (i % 5 === 0) {
                // Semi-special titles
                const titles = [
                    "The Battle Begins",
                    "Unexpected Turn",
                    "New Power",
                    "Dark Revelation",
                    "The Promise",
                    "Confrontation",
                    "The Truth",
                    "Lost and Found",
                    "Revenge",
                ];
                chapterTitle = `${titles[i % titles.length]}: Chapter ${i}`;
            } else {
                // Regular chapters just have number
                chapterTitle = `Chapter ${i}`;
            }
        }

        allChapters.push({
            id: `${mangaId}-chapter-${i}`,
            title: chapterTitle,
            number: i.toString(),
            date: releaseDate.toISOString().split("T")[0],
        });
    }

    // Sort chapters in descending order (newest first)
    return allChapters.sort((a, b) => parseInt(b.number) - parseInt(a.number));
};

// Cache for chapters to prevent unnecessary "API calls"
const chaptersCache = {};

/**
 * Service for providing manga data
 */
const mangaService = {
    /**
     * Get the API base URL
     * @returns {String} The API base URL
     */
    getBaseUrl: () => "http://localhost:5000/api",

    /**
     * Get list of manga
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getMangaList: async (params = {}) => {
        console.log("Fetching manga list with params:", params);

        // Handle different types of manga lists
        if (params && params.type) {
            switch (params.type) {
                case "popular":
                    // Sort by view count (descending)
                    const popularManga = [...DUMMY_MANGA_LIST].sort((a, b) => {
                        const viewsA = parseInt(a.view.replace(/[^0-9.]/g, ""));
                        const viewsB = parseInt(b.view.replace(/[^0-9.]/g, ""));
                        return viewsB - viewsA;
                    });
                    return { mangaList: popularManga };

                case "recent":
                    // For demonstration, we'll just reverse the list to simulate recently added
                    const recentManga = [...DUMMY_MANGA_LIST].reverse();
                    return { mangaList: recentManga };

                default:
                    return { mangaList: DUMMY_MANGA_LIST };
            }
        }

        return { mangaList: DUMMY_MANGA_LIST };
    },

    /**
     * Get manga details by ID
     * @param {String} id - Manga ID
     * @returns {Promise} - API response
     */
    getMangaDetails: async (id) => {
        console.log(`Fetching manga details for ID ${id}`);
        const manga = DUMMY_MANGA_LIST.find((manga) => manga.id === id);

        if (!manga) {
            throw new Error(`Manga with ID ${id} not found`);
        }

        return manga;
    },

    /**
     * Search manga by title
     * @param {String} query - Search query
     * @returns {Promise} - API response
     */
    searchManga: async (query, page = 1) => {
        console.log(`Searching manga with query "${query}"`);
        const results = DUMMY_MANGA_LIST.filter((manga) => manga.title.toLowerCase().includes(query.toLowerCase()));

        return {
            query,
            page,
            mangaList: results,
        };
    },

    /**
     * Get manga chapters
     * @param {String} id - Manga ID
     * @returns {Promise} - API response
     */
    getMangaChapters: async (id) => {
        console.log(`Fetching chapters for manga ID ${id}`);

        // Check cache first
        if (!chaptersCache[id]) {
            try {
                // Fetch from simulated external API
                chaptersCache[id] = await fetchExternalChapters(id);
                console.log(`Cached ${chaptersCache[id].length} chapters for manga ID ${id}`);
            } catch (error) {
                console.error(`Error fetching chapters for manga ID ${id}:`, error);
                throw new Error(`Failed to fetch chapters: ${error.message}`);
            }
        }

        // Ensure we have at least some dummy data if the API fails
        if (!chaptersCache[id] || chaptersCache[id].length === 0) {
            console.log(`No chapters found for manga ID ${id}, using fallback data`);
            // Use dummy data as fallback
            if (DUMMY_CHAPTERS[id]) {
                chaptersCache[id] = DUMMY_CHAPTERS[id];
            } else {
                // Create generic chapters if no dummy data exists for this manga
                chaptersCache[id] = Array.from({ length: 5 }, (_, i) => ({
                    id: `${id}-chapter-${i + 1}`,
                    title: `Chapter ${i + 1}`,
                    number: `${i + 1}`,
                    date: new Date().toISOString().split("T")[0],
                }));
            }
        }

        console.log(`Returning ${chaptersCache[id].length} chapters for manga ID ${id}`);

        return {
            chapters: chaptersCache[id],
            chapterCount: chaptersCache[id].length,
        };
    },

    /**
     * Get chapter images
     * @param {String} id - Chapter ID
     * @returns {Promise} - API response
     */
    getChapterImages: async (id) => {
        console.log(`Fetching images for chapter ID ${id}`);

        let images = DUMMY_CHAPTER_IMAGES[id];

        // Extract manga ID and chapter number from the ID
        // Expected format: manga-X-chapter-Y
        const idParts = id.split("-");
        let mangaId = null;
        let chapterNum = null;

        if (idParts.length >= 4) {
            // Try to extract manga ID
            mangaId = `${idParts[0]}-${idParts[1]}`;

            // Try to extract chapter number
            chapterNum = idParts[idParts.length - 1];
        }

        if (!images || images.length === 0) {
            console.log(`No images found for chapter ID ${id}, using fallback images`);

            // Use manga and chapter specific fallback URLs
            if (mangaId && chapterNum) {
                const mangaTitle = DUMMY_MANGA_LIST.find((m) => m.id === mangaId)?.title || "Manga";

                // Create fallback images with manga title and chapter number
                const fallbackImages = Array.from({ length: 5 }, (_, i) => {
                    const pageNum = i + 1;
                    return `https://via.placeholder.com/800x1200/cccccc/000000?text=${encodeURIComponent(
                        `${mangaTitle} Ch.${chapterNum} Pg.${pageNum}`
                    )}`;
                });

                return { images: fallbackImages };
            }

            // Generic fallback
            const fallbackImages = [
                "https://via.placeholder.com/800x1200/cccccc/000000?text=Page1",
                "https://via.placeholder.com/800x1200/cccccc/000000?text=Page2",
                "https://via.placeholder.com/800x1200/cccccc/000000?text=Page3",
                "https://via.placeholder.com/800x1200/cccccc/000000?text=Page4",
                "https://via.placeholder.com/800x1200/cccccc/000000?text=Page5",
            ];

            return { images: fallbackImages };
        }

        console.log(`Returning ${images.length} images for chapter ID ${id}`);
        return { images };
    },
};

module.exports = mangaService;
