const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
};



// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// module.exports = {
//   mode: 'development',
//   entry: {
//     app: './src/index.js',
//     print: './src/print.js',
//   },
//   devtool: 'inline-source-map',
//   plugins: [
//     // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
//     new CleanWebpackPlugin(),
//     new HtmlWebpackPlugin({
//       title: 'Development',
//     }),
//   ],
//   output: {
//     filename: '[name].bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
// }
