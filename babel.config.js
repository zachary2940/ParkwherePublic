module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['inline-dotenv','react-native-paper/babel',"@babel/plugin-proposal-export-namespace-from"]
  };
};
