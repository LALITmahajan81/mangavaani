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
        const chapters = DUMMY_CHAPTERS[id];

        if (!chapters) {
            throw new Error(`Chapters for manga ID ${id} not found`);
        }

        return { chapters };
    },

    /**
     * Get chapter images
     * @param {String} id - Chapter ID
     * @returns {Promise} - API response
     */
    getChapterImages: async (id) => {
        console.log(`Fetching images for chapter ID ${id}`);
        const images = DUMMY_CHAPTER_IMAGES[id];

        if (!images) {
            throw new Error(`Images for chapter ID ${id} not found`);
        }

        return { images };
    },
};

module.exports = mangaService;
