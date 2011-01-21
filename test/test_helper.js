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

var Client = function (data) {
		if(!data){
			data = {remoteAddress: '127.0.0.1', sessionId: rand(10000) }
		}
		this.connection = {remoteAddress: data.remoteAddress};
		this.sessionId = data.sessionId;
};
	
Client.prototype.send = function(data){
 return typeof data == 'object' ? JSON.stringify(data): data;
}

function rand(ceiling){
	return Math.floor(Math.random()*ceiling);
}
exports.Client = Client;
