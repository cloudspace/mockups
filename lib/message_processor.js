var sys = module.parent.exports.sys
  , fs	= module.parent.exports.fs;

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
		client.user.publish({ announcement: client.user.handle() + ' changed their display name to ' + data.new_name + '.' });

		client.user.name = data.new_name;
	},

	find_project: function(client, data) {
		if (!data.id) return;
		// TODO This is where mongodb will look up the project.
		// Technically, we'll be finding by hash rather than id in the future.

		if (!client.user.assign_project(data.id)) return;
	},

	create_project: function(client, data) {
		// TODO This is where mongodb will create the project.
		// id: 'new' is the new id created by create_project
		this.find_project(client, { id: 'new' });
  },

	message: function(client, data) {
		var msg = {  message: client.user.handle() + data };
		client.user.publish(msg, true); // TODO change to associate to projects
	},
};

// Our string escaper, which just trims and strips tags.
// TODO test
String.prototype.esc = function() {
	return this.trim().replace(/<[^>]*>?/g, '');
}

exports.MessageProcessor = MessageProcessor;

