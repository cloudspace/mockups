
var clients  = module.parent.exports.clients;

var User = function (client) {
	this.client			= client;
	this.ip					= client.connection.remoteAddress; // there is also a remotePort attribute, if we need it
	this.name				= 'Anonymous';
	this.channels   = {};
	this.project_id;
};

// Returns username and IP address.
// Example: "username (127.0.0.1)"
User.prototype.handle = function() {
	return this.name + ' (' + this.ip + ') ';
};

// Adds a user to a project.
// Returns true/false for success/failure.
User.prototype.assign_project = function(id, created_project) {
	if (typeof id == 'undefined') return false;

	// Remove user from current project.
	if (typeof this.project_id != 'undefined')
		this.unsubscribe(this.project_id);

	// Assign the project and return.
	this.project_id = id;
	this.created_project = created_project ? true : false;
	this.subscribe(id);
  return true;
};

// subscribe/unsubscribe/publish inspired by:
// http://stackoverflow.com/questions/4445883/node-websocket-server-possible-to-have-multiple-separate-broadcasts-for-a-sin

// Add user to a channel
// TODO add a broadcast to others in the channel
User.prototype.subscribe = function(channel) {
	this.channels[channel] = true; // We can use this to set permissions later.
};

// Remove user from a channel
// TODO add a broadcast to others in the channel
User.prototype.unsubscribe = function(channel) {
	if (!this.channels[channel]) return;
	delete this.channels[channel];
};

// Remove user from all channels
User.prototype.unsubscribe_all = function() {
	for (var i in this.channels)
		this.unsubscribe(i);
};

// Publish to a channel
User.prototype.publish = function(channel, msg, send_to_user) {
	for (var i in clients) {
		if (!send_to_user && clients[i].user == this) continue;
		if (typeof clients[i].user.channels[channel] != 'undefined') {
			clients[i].send(msg);
		}
	}
};

// Broadcast to the user's current project
User.prototype.broadcast_to_project = function(msg, send_to_user) {
	this.publish(this.project_id, msg, send_to_user);
}

exports.User = User;

