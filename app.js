var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;
    
server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;

  // Send 404 because nginx will handle requests for actual urls.
  // TODO It would be nice if we could decouple the 'url' requirement in the future,
  // since sockets are primarily going to be used for passing messages.
  //
  // The simpler option is to serve static files from node.js without nginx.
  send404(res);

/*
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Welcome. Try the <a href="/chat.html">chat</a> example.</h1>');
      res.end();
      break;
    // Obviously this is unacceptable as a way to serve static files.
    case '/example.js':
    case '/example.htm':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'example.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: send404(res);
  }
*/
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8080);

var io = io.listen(server);
  
io.on('connection', function(client){
  sys.puts(client);

  client.send({ connected: '' });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    client.broadcast(msg);
    client.send(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});

