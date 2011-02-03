var Project = require('./project').Project;

var MessageProcessor = {

  // Routes messages to their appropriate processors.
  // So a message like { user_update: {} } should call
  // user_update() with the data keyed by user_update.
	process: function (client, message) {
		for (var action in message) {
			if (this[action]) {
				this[action](client, message[action]);
			} else {
				console.log("Undefined action: " + action);
			}
		}
	},

  project_find: function(client, data) {
    Project.find_by_id(data.id, function(project) {
      if (project.error || !project.authorize(data.hash)) { // Project not found or unauthorized
        client.send({ error: project.error });
        return;
      }
      client.user.assign_project(project._id);
      client.send({ load_project: project });
    });
  },

	project_create: function(client, data) {
		Project.create(function(project) {
			client.user.assign_project(project._id);
			client.send({ load_project: project });
		});
  },

	// Allows a user to change their name.
	// Strips whitespace and html from the name.
	user_update: function(client, data) {
		if (typeof data.name != 'string') return false;
		data.name = data.name.esc();
		if (data.name == '' || data.name == client.user.name) return;

		client.user.name = data.name;
		client.send({
			announcement: 'You successfully changed your display name to ' + data.name + '.',
			user_update: { name: data.name }
		});
		client.user.broadcast_to_project({ announcement: client.user.handle() + ' changed their display name to ' + data.name + '.' });

	},

/*
	add_page: function(client, data) {
		Project.add_page(client.user.project_id, function(err, page) {
			if (typeof err != 'undefined') {
				client.send({ error: err });
			} else {
				var msg = { message: client.user.handle() + ' added a project page.'};
				client.user.broadcast_to_project(msg, true);
				client.user.broadcast_to_project({ add_page: { page: page } }, false);
				client.send({ add_page: { page: page, focus: true } });
			}
		});
	},

	delete_page: function(client, data) {
		Project.delete_page(client.user.project_id, data.page_id, function(err, page) {
			if (typeof err != 'undefined') {
				client.send({ error: err });
			} else {
				var msg = { message: client.user.handle() + ' deleted a project page.'};
				client.user.broadcast_to_project(msg, true);
				client.user.broadcast_to_project({ delete_page: { page: page } }, true);
			}
		});
	},

	update_project: function(client, data) {
		Project.update(data, function(err, project) {
			if (typeof err != 'undefined'){
				client.send({ error: '404' });
			} else {
				client.user.broadcast_to_project({ update_project: data}, true);
				var msg = { message: client.user.handle() + ' updated the project.'};
				client.user.broadcast_to_project(msg, true);
			}
		});
	},

	update_pages: function(client, data) {
		if(data.pages == undefined){ client.send({ error: 'Data needs a pages attribute.'});return;}

		Project.update(data, function(err, project) {
			if (typeof err != 'undefined'){
				client.send({ error: '404' });
			} else {
				client.user.broadcast_to_project({ update_pages: data}, true);
				var msg = { message: client.user.handle() + ' renamed a project page.'};
				client.user.broadcast_to_project(msg, true);
			}
		});

	},
	message: function(client, data) {
		var msg = {  message: client.user.handle() + data };
		client.user.broadcast_to_project(msg, true);
	},
*/

};

// Our string escaper, which just trims and strips tags.
// TODO test
String.prototype.esc = function() {
	return this.trim().replace(/<[^>]*>?/g, '');
};

exports.MessageProcessor = MessageProcessor;

