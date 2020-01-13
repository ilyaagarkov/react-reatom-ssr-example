const path = require('path');

const LoadablePlugin = require('@loadable/webpack-plugin');
// eslint-disable-next-line no-unused-vars
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  modify: (config, { target }) => {
    // do something to config

    if (target === 'web') {
      config.plugins.push(
        // new BundleAnalyzerPlugin,g
        new LoadablePlugin({ filename: 'stats.json', writeToDisk: true }),
      );
    }

    return {
      ...config,
      resolve: {
        ...config.resolve,
        modules: [path.resolve(__dirname, 'src'), ...config.resolve.modules],
      },
    };
  },
};
