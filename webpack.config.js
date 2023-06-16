
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './modules/main.js',
  output: {
    filename: 'reactweb.js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: "production",

  optimization: {
    minimize: true, // Desabilita a minificação
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true, // Desabilita a compressão
          mangle: true, // Desabilita a alteração de nomes de variáveis
        },
      }),
    ],
  },
};
