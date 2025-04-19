// Add to your Express app setup
app.use("/manga-images", express.static(path.join(__dirname, "../manga-images")));

// Then, add a message to console when server starts
console.log(`Manga images will be served from: ${path.join(__dirname, "../manga-images")}`);
