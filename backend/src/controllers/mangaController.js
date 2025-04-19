const mangaService = require("../services/mangaService");

/**
 * Manga controller for handling manga-related requests
 */
const mangaController = {
    /**
     * Get list of manga
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getMangaList: async (req, res) => {
        try {
            const mangaList = await mangaService.getMangaList(req.query);
            res.json(mangaList);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching manga list",
                error: error.message,
            });
        }
    },

    /**
     * Get manga details by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getMangaDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const mangaDetails = await mangaService.getMangaDetails(id);
            res.json(mangaDetails);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching manga details",
                error: error.message,
            });
        }
    },

    /**
     * Search manga by title
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    searchManga: async (req, res) => {
        try {
            const { query } = req.params;
            const searchResults = await mangaService.searchManga(query);
            res.json(searchResults);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error searching manga",
                error: error.message,
            });
        }
    },

    /**
     * Get manga chapters
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getMangaChapters: async (req, res) => {
        try {
            const { id } = req.params;
            const chapters = await mangaService.getMangaChapters(id);
            res.json(chapters);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching manga chapters",
                error: error.message,
            });
        }
    },

    /**
     * Get chapter images
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    getChapterImages: async (req, res) => {
        try {
            const { id } = req.params;
            const images = await mangaService.getChapterImages(id);
            res.json(images);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching chapter images",
                error: error.message,
            });
        }
    },
};

module.exports = mangaController;
