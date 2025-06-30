const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  let defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.resolver.resolverMainFields.unshift("sbmodern");

  // Add node polyfills for React Native
  defaultConfig.resolver.alias = {
    ...defaultConfig.resolver.alias,
    buffer: require.resolve('buffer'),
  };

  return defaultConfig;
})();
