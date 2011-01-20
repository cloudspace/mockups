var sys          = module.parent.exports.sys
  , fs           = module.parent.exports.fs;

var MessageProcessor = function (client, clients) {
  this.client  = client;
  this.clients = clients;
};

MessageProcessor.prototype.process = function (message) {
  if (message.action) {
    this[message.action](message[message.action]);
  } else {
    var msg = { message: this.client.user.handle() + message };
    this.client.broadcast(msg); // TODO change to associate to projects
    this.client.send(msg);
  }
};

MessageProcessor.prototype.update_name = function(data) {
  //User.prototype.set_name = function(new_name) {
    if (typeof data.new_name != 'string') return false;

    var new_name = data.new_name.trim();
    if (new_name != '') {
      this.client.send({ announcement: 'You successfully changed your display name to ' + new_name + '.', });
      this.client.broadcast({ announcement: this.client.user.handle() + ' changed their display name to ' + new_name + '.' });
      this.client.user.name = new_name;
      return true;
    } else {
      return false;
    }
  //}
};

exports.MessageProcessor = MessageProcessor;

