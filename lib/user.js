var sys			 = module.parent.exports.sys
  , fs			 = module.parent.exports.fs
  , clients  = module.parent.exports.clients;

var User = function (client) {
	this.client			= client;
	this.ip					= client.connection.remoteAddress; // there is also a remotePort attribute, if we need it
	this.name				= 'Anonymous';
	this.channels   = [];
	this.project_id;
};

// Returns username and IP address.
// Example: "username (127.0.0.1)"
User.prototype.handle = function() {
	return this.name + ' (' + this.ip + ') ';
};

// Adds a user to a project.
// Returns true/false for success/failure.
User.prototype.assign_project = function(id) {
	if (typeof id == 'undefined') return false;

	// Remove user from current project.
	if (typeof this.project_id != 'undefined')
		this.client.unsubscribe(this.project_id);

	// Assign the project and return.
	this.project_id = id;
	this.subscribe(id);
  return true;
};

// subscribe/unsubscribe/publish inspired by:
// http://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-sin

// Adds user to a channel
// TODO add a broadcast to others in the channel
User.prototype.subscribe = function(channel) {
	this.channels[channel] = true; // We can use this to set permissions later.
};

// Removes user from a channel
// TODO add a broadcast to others in the channel
User.prototype.unsubscribe = function(channel) {
	delete this.channels[channel];
};

// Removes user from all channels
User.prototype.unsubscribe_all = function() {
	for (var i in this.channels)
		this.unsubscribe(i);
};

// Broadcasts to a user's channel
User.prototype.publish = function(msg, send_to_user) {
	for (var i in clients) {
		if (!send_to_user && clients[i].user == this) continue;
		if (typeof clients[i].user.channels[this.project_id] != 'undefined') {
			clients[i].send(msg);
		}
	}
};

exports.User = User;

