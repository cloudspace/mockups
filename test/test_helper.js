var sys = require('sys')
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server;

var db = new Db('mockups_test', new Server("127.0.0.1", 27017, {}));
exports.clients = [];
exports.db      = db;

var assert = require('assert');
var User = require('../lib/user').User;
var Project = require('../lib/project').Project;
var Page = require('../lib/page').Page;
var CanvasObject = require('../lib/canvas_object').CanvasObject;

exports.it = function(description, test) {
	try {
		db.open(function(err, p_db) {
			db.collection('projects', function(err, collection) {
				//if (collection) collection.drop();
				test();
				sys.puts(" PASS: " + description);
			}); 
		});
	} catch (e) {
		sys.puts(" FAIL: " + description);
		sys.puts(" ~ " + e.stack);	
		sys.puts("\n");
	}
}

var Client = function(data) {
	if (!data) data = { remoteAddress: '127.0.0.1', sessionId: rand(10000) }
	this.connection = { remoteAddress: data.remoteAddress };
	this.sessionId = data.sessionId;
	this.user = new User(this);
	exports.clients.push(this);
};
	
Client.prototype.send = function(data) {
	this.sent = data; // TODO There should be a better way to do this.
	return typeof data == 'object' ? JSON.stringify(data) : data;
}

function rand(ceiling) {
	return Math.floor(Math.random()*ceiling);
}

exports.Client = Client;


