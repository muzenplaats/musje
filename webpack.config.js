const path = require('path')

const devOpts = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}

const buildOpts = {
  mode: 'production',
  entry: './src/musje.js',
  output: {
    filename: 'musje.js',
    path: path.resolve(__dirname),
    library: 'musje',
    libraryTarget: 'umd'
  }
}

module.exports = {
  // ...buildOpts,
  ...devOpts,

  module: {
    rules: [
      { test: /\.(style|mxl|musicxml)$/, use: 'raw-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 60000,
          }
        }
      },
      // {
      //   test: /\.(woff2?|ttf|eot|svg)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'fonts/'
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.js$/, exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-proposal-class-properties",
                { "loose": true }]
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8086
  }
}



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
