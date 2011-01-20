var sys          = module.parent.exports.sys
  , fs           = module.parent.exports.fs;
//, utf8Helper     = module.parent.exports.utf8Helper
//, stringParser   = module.parent.exports.stringParser


var User = function (client) {
  this.client = client;
  this.ip     = client.connection.remoteAddress; // there is also a remotePort attribute, if we need it
  this.name   = 'Anonymous';
};

User.prototype.handle = function() {
  return this.name + ' (' + this.ip + ') ';
};

exports.User = User;

