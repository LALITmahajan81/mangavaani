const axios = require("axios");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

/**
 * Service for providing manga data from MangaDex API
 */
const mangaService = {
    // MangaDex API Base URL
    mangaDexBaseUrl: process.env.MANGADEX_BASE_URL || "https://api.mangadex.org",
    mangaDexUploadsUrl: "https://uploads.mangadex.org",

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

        // Default params
        const apiParams = {
            limit: 20,
            offset: 0,
            includes: ["cover_art"],
            contentRating: ["safe", "suggestive"],
            order: {
                updatedAt: "desc",
            },
        };

        // Handle different types of manga lists
        if (params && params.type) {
            switch (params.type) {
                case "popular":
                    apiParams.order = { followedCount: "desc" };
                    break;
                case "recent":
                    apiParams.order = { latestUploadedChapter: "desc" };
                    break;
            }
        }

        try {
            const response = await axios.get(`${mangaService.mangaDexBaseUrl}/manga`, { params: apiParams });

            // Transform MangaDex response to match our application format
            const mangaList = response.data.data.map((manga) => {
                // Find cover file name
                const coverRelationship = manga.relationships.find((rel) => rel.type === "cover_art");
                let coverFileName = coverRelationship?.attributes?.fileName || "";

                return {
                    id: manga.id,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                    image: coverFileName
                        ? `${mangaService.mangaDexUploadsUrl}/covers/${manga.id}/${coverFileName}`
                        : "https://placehold.co/200x300?text=NoCover",
                    chapter: "Latest",
                    view: "N/A", // MangaDex doesn't provide view counts publicly
                    description:
                        manga.attributes.description?.en || Object.values(manga.attributes.description || {})[0] || "No description available",
                };
            });

            return { mangaList };
        } catch (error) {
            console.error("Error fetching manga list from MangaDex:", error);
            throw new Error(`Failed to fetch manga list: ${error.message}`);
        }
    },

    /**
     * Get manga details by ID
     * @param {String} id - Manga ID
     * @returns {Promise} - API response
     */
    getMangaDetails: async (id) => {
        console.log(`Fetching manga details for ID ${id}`);

        try {
            const response = await axios.get(`${mangaService.mangaDexBaseUrl}/manga/${id}?includes[]=cover_art&includes[]=author`);
            const manga = response.data.data;

            // Find cover file name
            const coverRelationship = manga.relationships.find((rel) => rel.type === "cover_art");
            let coverFileName = coverRelationship?.attributes?.fileName || "";

            // Find author name
            const authorRelationship = manga.relationships.find((rel) => rel.type === "author");
            let authorName = authorRelationship?.attributes?.name || "Unknown";

            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                image: coverFileName
                    ? `${mangaService.mangaDexUploadsUrl}/covers/${manga.id}/${coverFileName}`
                    : "https://placehold.co/200x300?text=NoCover",
                chapter: "Latest",
                view: "N/A",
                description: manga.attributes.description?.en || Object.values(manga.attributes.description || {})[0] || "No description available",
                author: authorName,
                status: manga.attributes.status,
                year: manga.attributes.year,
                tags: manga.attributes.tags.map((tag) => tag.attributes.name.en || Object.values(tag.attributes.name)[0]),
            };
        } catch (error) {
            console.error(`Error fetching manga details for ID ${id}:`, error);
            throw new Error(`Manga with ID ${id} not found or API error: ${error.message}`);
        }
    },

    /**
     * Search manga by title
     * @param {String} query - Search query
     * @returns {Promise} - API response
     */
    searchManga: async (query, page = 1) => {
        console.log(`Searching manga with query "${query}"`);

        try {
            const limit = 20;
            const offset = (page - 1) * limit;

            const response = await axios.get(`${mangaService.mangaDexBaseUrl}/manga`, {
                params: {
                    title: query,
                    limit,
                    offset,
                    includes: ["cover_art"],
                    contentRating: ["safe", "suggestive"],
                },
            });

            // Transform MangaDex response to match our application format
            const mangaList = response.data.data.map((manga) => {
                // Find cover file name
                const coverRelationship = manga.relationships.find((rel) => rel.type === "cover_art");
                let coverFileName = coverRelationship?.attributes?.fileName || "";

                return {
                    id: manga.id,
                    title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                    image: coverFileName
                        ? `${mangaService.mangaDexUploadsUrl}/covers/${manga.id}/${coverFileName}`
                        : "https://placehold.co/200x300?text=NoCover",
                    chapter: "Latest",
                    view: "N/A",
                    description:
                        manga.attributes.description?.en || Object.values(manga.attributes.description || {})[0] || "No description available",
                };
            });

            return {
                query,
                page,
                mangaList,
                total: response.data.total,
            };
        } catch (error) {
            console.error(`Error searching manga with query "${query}":`, error);
            throw new Error(`Failed to search manga: ${error.message}`);
        }
    },

    /**
     * Get manga chapters
     * @param {String} id - Manga ID
     * @returns {Promise} - API response
     */
    getMangaChapters: async (id) => {
        console.log(`Fetching chapters for manga ID ${id}`);

        try {
            const response = await axios.get(`${mangaService.mangaDexBaseUrl}/manga/${id}/feed`, {
                params: {
                    translatedLanguage: ["en"],
                    limit: 100,
                    order: {
                        chapter: "desc",
                    },
                },
            });

            // Transform MangaDex chapter response
            const chapters = response.data.data.map((chapter) => ({
                id: chapter.id,
                title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`,
                number: chapter.attributes.chapter,
                date: chapter.attributes.publishAt.split("T")[0],
                volume: chapter.attributes.volume,
            }));

            return {
                chapters,
                chapterCount: chapters.length,
            };
        } catch (error) {
            console.error(`Error fetching chapters for manga ID ${id}:`, error);
            throw new Error(`Failed to fetch chapters: ${error.message}`);
        }
    },

    /**
     * Get chapter images
     * @param {String} chapterId - Chapter ID
     * @returns {Promise} - API response with array of image URLs
     */
    getChapterImages: async (chapterId) => {
        console.log(`Fetching images for chapter ID ${chapterId}`);

        try {
            // First, get the chapter data to get the hash and file names
            const chapterResponse = await axios.get(`${mangaService.mangaDexBaseUrl}/chapter/${chapterId}`);
            const chapterData = chapterResponse.data.data;

            // Then get the actual server URL for the images
            const serverResponse = await axios.get(`${mangaService.mangaDexBaseUrl}/at-home/server/${chapterId}`);
            const baseUrl = serverResponse.data.baseUrl;

            // Construct the image URLs
            const hash = chapterData.attributes.hash;
            const fileNames = chapterData.attributes.data;
            const dataSaver = false; // Set to true if you want to use data-saver (compressed) images

            const images = fileNames.map((fileName) => {
                if (dataSaver) {
                    return `${baseUrl}/data-saver/${hash}/${fileName}`;
                } else {
                    return `${baseUrl}/data/${hash}/${fileName}`;
                }
            });

            return {
                images,
                pageCount: images.length,
                chapterId: chapterId,
            };
        } catch (error) {
            console.error(`Error fetching images for chapter ${chapterId}:`, error);
            throw new Error(`Failed to fetch chapter images: ${error.message}`);
        }
    },

    /**
     * Get chapter images directly (simpler method)
     * @param {String} chapterId - Chapter ID
     * @returns {Promise} - API response with array of direct image URLs
     */
    getChapterImagesSimple: async (chapterId) => {
        console.log(`Fetching images for chapter ID ${chapterId} (simple method)`);

        try {
            // Use the MangaDex Chapter API to get file details
            const chapterResponse = await axios.get(`${mangaService.mangaDexBaseUrl}/chapter/${chapterId}`);
            const chapterData = chapterResponse.data.data;

            if (!chapterData || !chapterData.attributes || !chapterData.attributes.hash) {
                throw new Error("Invalid chapter data from MangaDex");
            }

            const hash = chapterData.attributes.hash;
            const fileNames = chapterData.attributes.data || [];

            // Directly create URLs to MangaDex CDN (may have rate limiting)
            const imageUrls = fileNames.map((fileName) => `https://uploads.mangadex.org/data/${hash}/${fileName}`);

            // Also create data-saver URLs for backup
            const dataSaverUrls = fileNames.map((fileName) => `https://uploads.mangadex.org/data-saver/${hash}/${fileName}`);

            return {
                images: imageUrls,
                dataSaverImages: dataSaverUrls,
                pageCount: imageUrls.length,
                chapterId: chapterId,
                hash: hash,
            };
        } catch (error) {
            console.error(`Error fetching images for chapter ${chapterId}:`, error);
            throw new Error(`Failed to fetch chapter images: ${error.message}`);
        }
    },

    // Cache objects for improved performance
    chaptersCache: {},
    chapterImagesCache: {},
};

module.exports = mangaService;
