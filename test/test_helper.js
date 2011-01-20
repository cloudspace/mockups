var sys = require('sys')
var assert = require('assert')

exports.it = function(description, test) {
  try {
    test()
  } catch (e) {
    sys.puts("FAILURE: " + description)
    throw e
  }
}