if ("production" !== process.env.NODE_ENV) {
  module.exports = (new Function('return this')())
}
else {
  module.exports = {}
}

/* eslint-disable no-console */
module.exports.log = function() {
  console.log.apply(console, arguments)
}

module.exports.logStringified = function (...args) {
  args.forEach(s => console.log(JSON.stringify(s, null, 2)))
}
/* eslint-enable */

module.exports._ = require('lodash')
module.exports.Immutable = require('immutable')
