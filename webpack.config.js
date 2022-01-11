const path = require('path');

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: "./index.js",
  output: {
    filename: `index.js`,
    path: path.join(__dirname, 'dist'),
  },
  devtool: false,
  module:{
    rules:[
      {
        test: /(\.scss|\.css)$/,
        use: [
          path.resolve(__dirname, 'loader.js'),
          "css-loader",
        ],
      },
    ]
  }
};
