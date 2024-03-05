const path = require('path');
const nodeExternals = require('webpack-node-externals');


const config = {
  mode: 'production',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  target: 'web',
  // devtool: 'inline-source-map',
}

const testClientConfig = Object.assign({}, config, {
  entry: './client/test_client.ts',
  output: {
    filename: 'test-client.bundle.js',
    path: path.resolve(__dirname, "./hosted")
  }
});
const clientConfig = Object.assign({}, config, {
  entry: './client/client.ts',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, "./hosted")
  }
});

module.exports = [
  testClientConfig, clientConfig
]