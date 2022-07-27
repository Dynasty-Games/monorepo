const webpack = require('webpack')
const path = require('path')

module.exports = [{
  entry: {
    walletconnect: './src/wallet-connect.js'
  },
  mode: 'production',
  // optimization: {
  //   minimize: false
  // },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
  ],
  resolve: {
    // extensions: [ '.ts', '.js' ],
    fallback: {
      // "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
      // fs: false,
      // "path": require.resolve("path-browserify"),
      // "util": require.resolve("util/"),
      // "assert": require.resolve("assert/"),
    }
  },
  output: {
    library: {
      type: 'module'
    },
    filename: '[name].js',
    path: path.resolve(__dirname, 'www', 'walletconnect'),
  },
  experiments: {
    outputModule: true
  }
}]
