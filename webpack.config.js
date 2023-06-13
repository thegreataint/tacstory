module.exports = {
  // ... other webpack config options ...

  module: {
    rules: [
      // ... other rules ...

      // Configuration for source maps
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
};
