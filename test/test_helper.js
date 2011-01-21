var sys = require('sys')
var assert = require('assert')

exports.it = function(description, test) {
  try {
    test();
		sys.puts(" PASSED: " + description);
  } catch (e) {
    sys.puts(" FAILURE: " + description);
    sys.puts("  " + e.stack);	
		sys.puts("\n");
  }
}
