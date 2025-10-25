// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg");
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, "svg"];

defaultConfig.resolver.alias = {
  ...defaultConfig.resolver.alias,
  buffer: require.resolve("buffer"),
};

module.exports = defaultConfig;
