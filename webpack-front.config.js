const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: './client/test_client.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "./hosted")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  target: 'web',
  devtool: 'inline-source-map',
}