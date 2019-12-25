const LoadablePlugin = require('@loadable/webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something to config

    if (target === 'web') {
      config.plugins.push(
        // new BundleAnalyzerPlugin,g
        new LoadablePlugin({ filename: 'stats.json', writeToDisk: true,  })
      );
    }

    return config;
  },
};
