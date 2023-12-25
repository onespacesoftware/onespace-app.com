const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './main.js', // Replace with your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace 'dist' with your desired output directory
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/', // Output directory for images
            },
          },
        ],
      },
    ],
  },
};
