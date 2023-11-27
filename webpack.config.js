const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const configDev = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.jsx'),
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'build'),
    filename: 'main.[contenthash].js',
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
    modules: [path.resolve(__dirname, 'js'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        //loader: 'file-loader',
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        //loader: 'file-loader',
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        //type: 'asset/resource',
        generator: {
          filename: path.join('icons', '[name].[contenthash][ext]'),
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: 'index.html',
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['build'],
        },
        onEnd: {
          copy: [
            {
              source: path.join('src'),
              destination: 'build',
            },
          ],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  devServer: {
    proxy: {
      '/core': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
      '/api.php': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
      '/apiLobby.php': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
    },
    watchFiles: path.join(__dirname, 'public'),
    historyApiFallback: true,
    port: 3000,
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { name: 'preset-default' }],
            ],
          },
        },
      }),
    ],
  },
};

const configProd = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.jsx'),
  output: {
    publicPath: '/static/',
    path: path.join(__dirname, 'build/static'),
    filename: 'main.[contenthash].js',
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
    modules: [path.resolve(__dirname, 'js'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        //loader: 'file-loader',
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        //loader: 'file-loader',
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        //type: 'asset/resource',
        generator: {
          filename: path.join('icons', '[name].[contenthash][ext]'),
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: '../index.html',
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ['build'],
        },
        onEnd: {
          copy: [
            {
              source: path.join('src'),
              destination: 'build/static',
            },
          ],
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  devServer: {
    proxy: {
      '/core': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
      '/api.php': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
      '/apiLobby.php': {
        target: DOMAIN,
        secure: false,
        changeOrigin: true,
      },
    },
    watchFiles: path.join(__dirname, 'src'),
    historyApiFallback: true,
    port: 3000,
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', { name: 'preset-default' }],
            ],
          },
        },
      }),
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    configDev.mode = 'development';
    return configDev;
  }
  if (argv.mode === 'production') {
    configProd.mode = 'production';
    return configProd;
  }
};
