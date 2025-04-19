const fs = require("fs");
const path = require("path");

/**
 * Service for providing manga data from local storage
 */
const localMangaService = {
    /**
     * Base directory for manga storage
     */
    baseMangaDir: path.join(__dirname, "../../manga-images"),

    /**
     * Initialize the local manga storage
     */
    init: () => {
        // Create directory if it doesn't exist
        if (!fs.existsSync(localMangaService.baseMangaDir)) {
            fs.mkdirSync(localMangaService.baseMangaDir, { recursive: true });
            console.log(`Created manga directory: ${localMangaService.baseMangaDir}`);
        }
    },

    /**
     * Get list of locally stored manga
     * @returns {Promise} - List of manga
     */
    getMangaList: async () => {
        try {
            // Read manga directories
            const mangaDirs = fs
                .readdirSync(localMangaService.baseMangaDir)
                .filter((dir) => fs.statSync(path.join(localMangaService.baseMangaDir, dir)).isDirectory());

            // Map each directory to a manga object
            const mangaList = mangaDirs.map((dir) => {
                // Try to read metadata.json if it exists
                let metadata = {};
                const metadataPath = path.join(localMangaService.baseMangaDir, dir, "metadata.json");

                if (fs.existsSync(metadataPath)) {
                    try {
                        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
                    } catch (e) {
                        console.error(`Error reading metadata for ${dir}:`, e);
                    }
                }

                // Set default values if not in metadata
                return {
                    id: dir,
                    title: metadata.title || dir,
                    image: metadata.coverImage || `/manga-images/${dir}/cover.jpg`,
                    description: metadata.description || "No description available",
                    author: metadata.author || "Unknown",
                    status: metadata.status || "unknown",
                };
            });

            return { mangaList };
        } catch (error) {
            console.error("Error fetching local manga list:", error);
            throw new Error(`Failed to fetch manga list: ${error.message}`);
        }
    },

    /**
     * Get manga details by ID (directory name)
     * @param {String} id - Manga ID/directory name
     * @returns {Promise} - Manga details
     */
    getMangaDetails: async (id) => {
        try {
            const mangaDir = path.join(localMangaService.baseMangaDir, id);

            // Check if directory exists
            if (!fs.existsSync(mangaDir)) {
                throw new Error(`Manga with ID ${id} not found`);
            }

            // Try to read metadata.json
            let metadata = {};
            const metadataPath = path.join(mangaDir, "metadata.json");

            if (fs.existsSync(metadataPath)) {
                try {
                    metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
                } catch (e) {
                    console.error(`Error reading metadata for ${id}:`, e);
                }
            }

            return {
                id,
                title: metadata.title || id,
                image: metadata.coverImage || `/manga-images/${id}/cover.jpg`,
                description: metadata.description || "No description available",
                author: metadata.author || "Unknown",
                status: metadata.status || "unknown",
                year: metadata.year || "Unknown",
                tags: metadata.tags || [],
            };
        } catch (error) {
            console.error(`Error fetching local manga details for ${id}:`, error);
            throw new Error(`Failed to fetch manga details: ${error.message}`);
        }
    },

    /**
     * Get manga chapters by manga ID
     * @param {String} id - Manga ID/directory name
     * @returns {Promise} - List of chapters
     */
    getMangaChapters: async (id) => {
        try {
            const mangaDir = path.join(localMangaService.baseMangaDir, id);

            // Check if directory exists
            if (!fs.existsSync(mangaDir)) {
                throw new Error(`Manga with ID ${id} not found`);
            }

            // Get all chapter directories
            const chapterDirs = fs.readdirSync(mangaDir).filter((dir) => {
                const fullPath = path.join(mangaDir, dir);
                return fs.statSync(fullPath).isDirectory() && dir.startsWith("chapter-");
            });

            // Map each directory to a chapter object
            const chapters = chapterDirs.map((dir) => {
                // Extract chapter number from directory name
                const chapterNum = dir.replace("chapter-", "");

                return {
                    id: `${id}_${dir}`,
                    title: `Chapter ${chapterNum}`,
                    number: chapterNum,
                    date: new Date().toISOString().split("T")[0], // Use current date
                    volume: null,
                };
            });

            // Sort chapters by number
            chapters.sort((a, b) => parseFloat(b.number) - parseFloat(a.number));

            return {
                chapters,
                chapterCount: chapters.length,
            };
        } catch (error) {
            console.error(`Error fetching chapters for ${id}:`, error);
            throw new Error(`Failed to fetch chapters: ${error.message}`);
        }
    },

    /**
     * Get chapter images
     * @param {String} chapterId - Chapter ID in format "mangaId_chapter-X"
     * @returns {Promise} - Array of image URLs
     */
    getChapterImages: async (chapterId) => {
        try {
            // Parse manga ID and chapter directory from chapter ID
            const [mangaId, chapterDir] = chapterId.split("_");

            const chapterPath = path.join(localMangaService.baseMangaDir, mangaId, chapterDir);

            // Check if directory exists
            if (!fs.existsSync(chapterPath)) {
                throw new Error(`Chapter with ID ${chapterId} not found`);
            }

            // Get all image files
            const imageFiles = fs
                .readdirSync(chapterPath)
                .filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
                })
                .sort(); // Sort by filename

            // Create URLs for each image
            const images = imageFiles.map((file) => {
                return `/manga-images/${mangaId}/${chapterDir}/${file}`;
            });

            return {
                images,
                pageCount: images.length,
                chapterId,
            };
        } catch (error) {
            console.error(`Error fetching images for chapter ${chapterId}:`, error);
            throw new Error(`Failed to fetch chapter images: ${error.message}`);
        }
    },

    /**
     * Add a new manga
     * @param {Object} manga - Manga data
     * @returns {Promise} - Added manga
     */
    addManga: async (manga) => {
        try {
            // Generate ID from title if not provided
            const id = manga.id || manga.title.toLowerCase().replace(/\s+/g, "-");
            const mangaDir = path.join(localMangaService.baseMangaDir, id);

            // Create directory if it doesn't exist
            if (!fs.existsSync(mangaDir)) {
                fs.mkdirSync(mangaDir, { recursive: true });
            }

            // Save metadata
            const metadata = {
                title: manga.title,
                description: manga.description || "No description available",
                author: manga.author || "Unknown",
                status: manga.status || "unknown",
                year: manga.year || new Date().getFullYear().toString(),
                tags: manga.tags || [],
                coverImage: manga.coverImage || `/manga-images/${id}/cover.jpg`,
            };

            fs.writeFileSync(path.join(mangaDir, "metadata.json"), JSON.stringify(metadata, null, 2));

            return {
                id,
                ...metadata,
            };
        } catch (error) {
            console.error("Error adding manga:", error);
            throw new Error(`Failed to add manga: ${error.message}`);
        }
    },

    /**
     * Add a chapter to manga
     * @param {String} mangaId - Manga ID
     * @param {Object} chapter - Chapter data
     * @returns {Promise} - Added chapter
     */
    addChapter: async (mangaId, chapter) => {
        try {
            const mangaDir = path.join(localMangaService.baseMangaDir, mangaId);

            // Check if manga directory exists
            if (!fs.existsSync(mangaDir)) {
                throw new Error(`Manga with ID ${mangaId} not found`);
            }

            // Generate chapter directory name
            const chapterDir = `chapter-${chapter.number.padStart(3, "0")}`;
            const chapterPath = path.join(mangaDir, chapterDir);

            // Create chapter directory if it doesn't exist
            if (!fs.existsSync(chapterPath)) {
                fs.mkdirSync(chapterPath, { recursive: true });
            }

            return {
                id: `${mangaId}_${chapterDir}`,
                title: chapter.title || `Chapter ${chapter.number}`,
                number: chapter.number,
                date: new Date().toISOString().split("T")[0],
                volume: chapter.volume || null,
            };
        } catch (error) {
            console.error(`Error adding chapter to manga ${mangaId}:`, error);
            throw new Error(`Failed to add chapter: ${error.message}`);
        }
    },
};

// Initialize on import
localMangaService.init();

module.exports = localMangaService;
