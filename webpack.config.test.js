var path = require('path')

module.exports = require('./make-webpack-config')({
  mode: 'development',
  karma: true,
  entry: [path.join(__dirname, 'test')]
})
