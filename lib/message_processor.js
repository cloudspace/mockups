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
		Project.find(data, function(err, project) {
			if (typeof err != 'undefined') {
				client.send({ error: '404' }); // Project not found...
			} else {
				client.user.assign_project(project._id);
				client.send({ load_project: project });
			}
		});
	},

	create_project: function(client, data) {
		new Project(function(project) {
			client.send({ load_project: project });
		});
  },

	add_page: function(client, data) {
		Project.add_page(client.user.project_id, function(err, page) {
			if (typeof err != 'undefined') {
				client.send({ error: err });
			} else {
				client.user.broadcast_to_project({ add_page: page }, true);
			}
		});
	},

	update_project: function(client, data) {
		Project.update(data, function(err, project) {
			if (typeof err != 'undefined'){
				client.send({ error: '404' });
			} else {
				client.send({ update_project: data});
			}
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
};

exports.MessageProcessor = MessageProcessor;

