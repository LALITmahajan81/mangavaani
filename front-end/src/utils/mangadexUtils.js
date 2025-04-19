/**
 * Utility functions for working with MangaDex API
 */

// Constants
export const MANGADEX_BASE_URL = "https://api.mangadex.org";
export const MANGADEX_UPLOADS_URL = "https://uploads.mangadex.org";

/**
 * Formats a MangaDex chapter image URL
 * @param {String} baseUrl - Base URL from MangaDex server response
 * @param {String} hash - Chapter hash
 * @param {String} filename - Image filename
 * @param {Boolean} dataSaver - Whether to use data-saver version
 * @returns {String} Full image URL
 */
export const formatChapterImageUrl = (baseUrl, hash, filename, dataSaver = false) => {
    const quality = dataSaver ? "data-saver" : "data";
    return `${baseUrl}/${quality}/${hash}/${filename}`;
};

/**
 * Validates if an ID appears to be a MangaDex UUID
 * @param {String} id - ID to check
 * @returns {Boolean} True if it appears to be a MangaDex ID
 */
export const isMangaDexId = (id) => {
    if (!id) return false;
    // MangaDex uses UUIDs which are 36 characters long with 4 hyphens
    return id.length === 36 && id.split("-").length === 5;
};

/**
 * Validates a MangaDex image URL
 * @param {String} url - URL to validate
 * @returns {Boolean} True if the URL is valid
 */
export const isValidMangaDexImageUrl = (url) => {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        // Check if it's from a MangaDex domain
        return parsed.hostname.includes("uploads.mangadex.org") || parsed.hostname.includes("mangadex.org");
    } catch (error) {
        return false;
    }
};

/**
 * Handles error fallback for image loading
 * @param {String} url - Original image URL that failed
 * @param {Boolean} useDataSaver - Whether to try data-saver version
 * @returns {String} Fallback URL or a placeholder
 */
export const getImageFallback = (url, useDataSaver = false) => {
    if (!url) return "https://placehold.co/800x1200?text=Image+Not+Found";

    // If the URL is already a placeholder, return it
    if (url.includes("placehold.co")) return url;

    // If this is a MangaDex image and we're not already using data-saver
    if (url.includes("/data/") && useDataSaver) {
        // Try data-saver version if original failed
        return url.replace("/data/", "/data-saver/");
    }

    // Check if this is a MangaDex upload
    if (url.includes("uploads.mangadex.org")) {
        // For covers
        if (url.includes("/covers/")) {
            return "https://placehold.co/400x600?text=Manga+Cover+Not+Available";
        }
    }

    // Generate a page number from the URL if possible
    let pageNum = "Unknown";
    try {
        const filename = url.split("/").pop();
        const match = filename.match(/\d+/);
        if (match) pageNum = match[0];
    } catch (e) {
        // Ignore parsing errors
    }

    // Return a placeholder with a friendlier message
    return `https://placehold.co/800x1200?text=Page+${pageNum}+Not+Available`;
};

/**
 * Format MangaDex manga data to our app's format
 * @param {Object} manga - MangaDex manga data
 * @returns {Object} Formatted manga object
 */
export const formatMangaData = (manga) => {
    const attributes = manga.attributes;
    const relationships = manga.relationships || [];

    // Get title (prefer English)
    const title = attributes.title.en || Object.values(attributes.title)[0] || "Unknown Title";

    // Find cover art
    const coverArt = relationships.find((rel) => rel.type === "cover_art");
    let coverFilename = coverArt?.attributes?.fileName || "";
    const imageUrl = coverFilename ? `${MANGADEX_UPLOADS_URL}/covers/${manga.id}/${coverFilename}` : "https://placehold.co/200x300?text=No+Cover";

    // Get description
    const description = attributes.description?.en || (attributes.description ? Object.values(attributes.description)[0] : "") || "";

    // Find author info
    const author = relationships.find((rel) => rel.type === "author");
    const authorName = author?.attributes?.name || "Unknown";

    // Return formatted manga data
    return {
        id: manga.id,
        title: title,
        image: imageUrl,
        description: description,
        status: attributes.status || "unknown",
        year: attributes.year || "Unknown",
        author: authorName,
        rating: "4.5", // Default rating since MangaDex doesn't provide ratings directly in this API
    };
};

/**
 * Format MangaDex chapter data to our app's format
 * @param {Object} chapter - MangaDex chapter data
 * @returns {Object} Formatted chapter object
 */
export const formatChapterData = (chapter) => {
    const attributes = chapter.attributes;

    return {
        id: chapter.id,
        title: attributes.title || `Chapter ${attributes.chapter}`,
        number: attributes.chapter || "N/A",
        volume: attributes.volume || null,
        date: attributes.publishAt || attributes.createdAt,
        language: attributes.translatedLanguage || "en",
    };
};

export default {
    formatChapterImageUrl,
    isMangaDexId,
    isValidMangaDexImageUrl,
    getImageFallback,
    formatMangaData,
    formatChapterData,
};
