var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;

exports.sys			 = sys;
exports.fs			 = fs;
exports.channels = {};

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

// Is this the proper notation?
var User = require('./lib/user.js').User
  , MessageProcessor = require('./lib/message_processor').MessageProcessor
  , Channel = require('./lib/channel.js').Channel
  , io = io.listen(server)
  , clients = {};

io.on('connection', function(client){

	// These happen on the initial connection of a client.
	clients[client.sessionId] = client; // Add client to clients list
	client.user = new User(client);			// Set up client.user
	client.send({ connected: '' });			// Respond with 'connected' message

	// Let everyone know about the connection
	// TODO restrict this to a project
	client.broadcast({ announcement: client.user.ip + ' connected' });

	client.on('message', function(message){
		MessageProcessor.process(client, message);
	});

	client.on('disconnect', function(){
		client.user.remove_channels();
		// TODO restrict this to a project
		client.broadcast({ announcement: client.user.ip + ' disconnected' });
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

