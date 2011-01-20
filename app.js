var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;

exports.sys = sys;
exports.fs   = fs;


    
server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;

  // Send 404 because nginx will handle requests for actual urls.
  // TODO It would be nice if we could decouple the 'url' requirement in the future,
  // since sockets are primarily going to be used for passing messages.
  //
  // The simpler option is to serve static files from node.js without nginx.
  // send404(res);

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

var User = require('./lib/user.js').User;