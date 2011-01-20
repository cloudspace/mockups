var sys          = module.parent.exports.sys
  , fs           = module.parent.exports.fs;

var MessageProcessor = function (client, clients) {
  this.client  = client;
  this.clients = clients;
};

MessageProcessor.prototype.process = function (message) {
  if (message.type) {
    if (message.type == 'name_change') {
      var msg = { message: this.client.user.name + ' (' + this.client.user.ip + ') changed their display name to ' + message[message.type] };
      this.client.user.name = message[message.type];
      this.client.broadcast(msg);
      this.client.send(msg);
    }
  } else {
    var msg = { message: this.client.user.name + ' (' + this.client.user.ip + ') ' + message };
    this.client.broadcast(msg); // TODO change to associate to projects
    this.client.send(msg);
  }
};

exports.MessageProcessor = MessageProcessor;

