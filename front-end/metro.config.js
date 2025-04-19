// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any additional configuration here
config.resolver.sourceExts = ["jsx", "js", "ts", "tsx", "json"];

// Make sure the entry point is correctly set
config.resolver.resolverMainFields = ["browser", "main"];

module.exports = config;
