const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { promises: fsPromises } = require("fs");

// Configuration
const MANGA_ROOT_DIR = path.join(__dirname, "../manga-images");
const SAMPLE_MANGA = [
    {
        id: "manga-1",
        folder: "one-piece",
        chapters: [1, 2, 3],
        pages_per_chapter: 5,
    },
    {
        id: "manga-2",
        folder: "demon-slayer",
        chapters: [1, 2, 3],
        pages_per_chapter: 5,
    },
];

// Create directory if it doesn't exist
async function ensureDirectoryExists(dir) {
    try {
        await fsPromises.mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    } catch (err) {
        if (err.code !== "EEXIST") {
            console.error(`Error creating directory ${dir}:`, err);
            throw err;
        }
    }
}

// Download an image and save it to the specified path
async function downloadImage(url, outputPath) {
    try {
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "stream",
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error.message);
        throw error;
    }
}

// Set up manga directories and download placeholder images
async function setupSampleManga() {
    try {
        // Ensure main manga directory exists
        await ensureDirectoryExists(MANGA_ROOT_DIR);

        // Process each manga
        for (const manga of SAMPLE_MANGA) {
            const mangaDir = path.join(MANGA_ROOT_DIR, manga.folder);
            await ensureDirectoryExists(mangaDir);

            // Process each chapter
            for (const chapterNum of manga.chapters) {
                const formattedChapterNum = chapterNum.toString().padStart(3, "0");
                const chapterDir = path.join(mangaDir, `chapter-${formattedChapterNum}`);
                await ensureDirectoryExists(chapterDir);

                // Download pages for the chapter
                for (let pageNum = 1; pageNum <= manga.pages_per_chapter; pageNum++) {
                    const formattedPageNum = pageNum.toString().padStart(3, "0");
                    const imagePath = path.join(chapterDir, `page-${formattedPageNum}.jpg`);

                    // Skip if file already exists
                    if (fs.existsSync(imagePath)) {
                        console.log(`File already exists: ${imagePath}`);
                        continue;
                    }

                    // Create placeholder URL with manga and chapter info
                    const placeholderUrl = `https://placehold.co/800x1200?text=${encodeURIComponent(
                        manga.folder
                    )}+Chapter+${chapterNum}+Page+${pageNum}`;

                    console.log(`Downloading image for ${manga.folder}, chapter ${chapterNum}, page ${pageNum}...`);
                    await downloadImage(placeholderUrl, imagePath);
                    console.log(`Downloaded: ${imagePath}`);
                }
            }
        }

        console.log("Sample manga setup complete!");
    } catch (error) {
        console.error("Error setting up sample manga:", error);
    }
}

// Run the setup
setupSampleManga();
