const express = require("express");
const mangaController = require("../controllers/mangaController");

const router = express.Router();

/**
 * @route   GET /api/manga
 * @desc    Get manga list with optional filters
 * @access  Public
 */
router.get("/", mangaController.getMangaList);

/**
 * @route   GET /api/manga/:id
 * @desc    Get manga details by ID
 * @access  Public
 */
router.get("/:id", mangaController.getMangaDetails);

/**
 * @route   GET /api/manga/:id/chapters
 * @desc    Get manga chapters by manga ID
 * @access  Public
 */
router.get("/:id/chapters", mangaController.getMangaChapters);

/**
 * @route   GET /api/manga/chapter/:id
 * @desc    Get chapter images by chapter ID
 * @access  Public
 */
router.get("/chapter/:id", mangaController.getChapterImages);

/**
 * @route   GET /api/manga/chapter/:id/simple
 * @desc    Get chapter images by chapter ID (simplified method)
 * @access  Public
 */
router.get("/chapter/:id/simple", mangaController.getChapterImagesSimple);

/**
 * @route   GET /api/manga/search/:query
 * @desc    Search manga by title
 * @access  Public
 */
router.get("/search/:query", mangaController.searchManga);

module.exports = router;
