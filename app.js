
require.paths.unshift(".");
var http = require('http')
  , path = require('path')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server
  , clients = []
  , Db = require('mongodb').Db
  , Server = require('mongodb').Server;

exports.sys			 = sys;
exports.fs			 = fs;
exports.clients  = clients;
exports.db       = new Db('mockups', new Server("127.0.0.1", 27017, {}));

var User = require('./lib/user').User
  , Project = require('./lib/project').Project
  , MessageProcessor = require('./lib/message_processor').MessageProcessor;

server = http.createServer(function(req, res){
	var path = url.parse(req.url).pathname;

	switch (path){
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('Look at my pokemans!');
			res.end();
			break;
		default: send404(res);
	}
}),

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8080);

var io = io.listen(server);

io.on('connection', function(client){

	// These happen on the initial connection of a client.
	clients.push(client);           // Add client to clients list
	client.user = new User(client); // Set up client.user
	client.send({ connected: '' }); // Respond with 'connected' message

	client.on('message', function(message){
		MessageProcessor.process(client, message);
	});

	client.on('disconnect', function(){
		client.user.unsubscribe_all();
		// TODO restrict this to a project
		//client.broadcast({ announcement: client.user.ip + ' disconnected' });
	});
});

// We may want to add this elsewhere.
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


