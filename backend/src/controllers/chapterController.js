// Create a placeholder URL for each page
for (let i = 1; i <= pageCount; i++) {
    const pageName = `page${i.toString().padStart(3, "0")}.jpg`;
    const pageUrl = `https://placehold.co/800x1200?text=${encodeURIComponent(mangaName)}+Ch${chapterNumber}+Page${i}`;
    chapterPages.push({
        id: `${chapterId}_page${i}`,
        pageNumber: i,
        imageUrl: pageUrl,
        name: pageName,
    });
}
