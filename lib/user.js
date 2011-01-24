var sys			 = module.parent.exports.sys
  , fs			 = module.parent.exports.fs
  , projects = module.parent.exports.projects;

var User = function (client) {
	this.client			= client;
	this.ip					= client.connection.remoteAddress; // there is also a remotePort attribute, if we need it
	this.name				= 'Anonymous';
	this.project_id = 0;
};

// Returns username and IP address.
// Example: "username (127.0.0.1)"
User.prototype.handle = function() {
	return this.name + ' (' + this.ip + ') ';
};

// Adds a user to a channel.
// Returns true if it succeeds and false if it fails.
User.prototype.add_channel = function(id) {
	if (id == 0) return false;

	if (!projects[id]) projects[id] = {};
	projects[id][this.client.sessionId] = this.client;
	this.project_id = id;
	return true;
};

// Removes a user from a channel.
// Returns true if it succeeds and false if it fails.
User.prototype.remove_channel = function(id) {
	if (!projects[this.project_id]) return;

	// Delete the user's client from the project's list
	delete projects[this.project_id][this.client.sessionId];
	// Delete the project's list if it is now empty
	if (Object.size(projects[this.project_id]) == 0) delete projects[this.project_id];
};

// Removes a user from all channels.
User.prototype.remove_channels = function() {
	if (!projects[this.project_id]) return;

	// Delete the user's client from the project's list
	delete projects[this.project_id][this.client.sessionId];
	// Delete the project's list if it is now empty
	if (Object.size(projects[this.project_id]) == 0) delete projects[this.project_id];
}

User.prototype.broadcast = function(message) {
	if (this.project_id == 0) return;
	for (var client in projects[this.project_id]) {
		if (projects[this.project_id][client] != this.client) projects[this.project_id][client].send(message);
	}
};

exports.User = User;

