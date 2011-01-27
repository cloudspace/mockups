var Project = require('./project').Project;

var MessageProcessor = {

  // Routes messages to their appropriate processors.
  // So a message like { update_name: {} } should call
  // update_name() with the data keyed by update_name.
	process: function (client, message) {
		for (var action in message) {
			if (this[action]) {
				this[action](client, message[action]);
			} else {
				console.log("Undefined action: " + action);
			}
		}
	},

	// Allows a user to change their name.
	// Strips whitespace and html from the name.
	update_name: function(client, data) {
		if (typeof data.new_name != 'string') return false;
		data.new_name = data.new_name.esc();
		if (data.new_name == '' || data.new_name == client.user.name) return;

		client.send({
			announcement: 'You successfully changed your display name to ' + data.new_name + '.',
			update_name: { new_name: data.new_name }
		});
		client.user.broadcast_to_project({ announcement: client.user.handle() + ' changed their display name to ' + data.new_name + '.' });

		client.user.name = data.new_name;
	},

	find_project: function(client, data) {
		if (!data.hash) return;

		Project.find(data.hash, function(err, project) {
			if (typeof err != 'undefined') {
				client.send({ error: err });
			} else {
				client.user.assign_project(project._id);
			}
		});
	},

	create_project: function(client, data) {
		new Project(function(project) {
			client.user.assign_project(project._id)
		});
  },

	message: function(client, data) {
		var msg = {  message: client.user.handle() + data };
		client.user.broadcast_to_project(msg, true);
	},
};

// Our string escaper, which just trims and strips tags.
// TODO test
String.prototype.esc = function() {
	return this.trim().replace(/<[^>]*>?/g, '');
}

exports.MessageProcessor = MessageProcessor;

