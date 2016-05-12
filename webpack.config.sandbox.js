var path = require('path')

module.exports = require('./make-webpack-config')({
  mode: 'development',
  watch: true,
  entry: [path.join(__dirname, 'sandbox')]
})
