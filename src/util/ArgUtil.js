var _ = require('lodash')
var minimist = require('minimist')

function parseArgs() {
  var rawArgs = minimist(process.argv.slice(2))
  var filtered = _.omit(rawArgs, '_') // For some reason, minimist seems to always put _: [] into the returned object.
  // --option false will get parsed as option: "false". Look for boolean strings, and
  // convert them to Javascript booleans.
  var boolConverted = _.mapValues(filtered, function(value) {
    if (value === 'false') return false
    if (value === 'true' ) return true
    return value
  })
  return boolConverted
}

//function getBoolArg(argName, defaultValue) {
//  return getBoolOption(parseArgs(), argName, defaultValue);
//}
//
//function getBoolOption(options, argName, defaultValue) {
//  // If you pass an arg of --option false, minimist will parse it as { option: "false" }.
//  // Calling JSON.parse converts the string value to a boolean.
//  return _.has(options, argName) ? !!JSON.parse(options[argName]) : !!defaultValue;
//}
//
//function toStringArgs(options) {
//  var stringArgs = Object.keys(options).map(function(key) { return "--" + key + " " + JSON.stringify(options[key]) }).join(' ');
//  console.log("toStringArgs returning: \"" + stringArgs + "\"");
//  return stringArgs;
//}

module.exports = {
  parseArgs:      parseArgs
}
