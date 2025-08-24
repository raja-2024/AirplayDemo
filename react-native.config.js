module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
    },
  },
  dependencies: {
    'react-native-video': {
      platforms: {
        ios: {
          podspecPath: '../node_modules/react-native-video/react-native-video.podspec',
        },
      },
    },
  },
};
