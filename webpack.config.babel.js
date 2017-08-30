import webpack from 'webpack'
import fs from 'fs-extra'
import Bufferify from 'webpack-bufferify'

class UseModuleWithDefault extends Bufferify {
  process(content) {
    return `${content}\r\nwindow["HHuploadify"] = window["HHuploadify"]["default"];`
  }
}

export default {
  entry: {
    'HHuploadify': './src/HHuploadify.js',
    'HHuploadify.dragable': './src/HHuploadify.dragable.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'HHuploadify',
    libraryTarget: 'window',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|bower_components/,
        options: {
          presets: [['env', {modules: false}]],
          babelrc: false,
        },
      },
    ],
  },
  plugins: [
    new UseModuleWithDefault(),
  ],
}

fs.copy('./src/HHuploadify.css', './dist/HHuploadify.css')
