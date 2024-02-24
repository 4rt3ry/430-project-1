const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: false
  },
  entry: './src/server.ts',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, "./src")
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
  target: 'node',
  externals: [
    nodeExternals()
  ]
}