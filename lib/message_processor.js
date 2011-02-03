var Project = require('./project').Project
  , Page    = require('./page').Page;

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
      if (project.error) { // Project not created for some reason...
        client.send({ error: project.error });
        return;
      }
			client.user.assign_project(project._id);
			client.send({ load_project: project });
		});
  },

	project_update: function(client, data) {
    Project.find_by_id(client.user.project_id, function(project) {
			project.update(data, function(project) {
				if (project.error) {
					client.send({ error: project.error });
					return;
				}
				client.user.broadcast_to_project({ project_update: data }, true);
				client.user.broadcast_to_project({ message: client.user.handle() + ' updated the project.'}, true);
			});
		});
	},

	page_create: function(client, data) {
    Project.find_by_id(client.user.project_id, function(project) {
			Page.create(project, function(page) {
				if (page.error) {
					client.send({ error: page.error });
					return;
				}
				client.user.broadcast_to_project({ message: client.user.handle() + ' added a project page.'}, true);
				client.user.broadcast_to_project({ page_create: { page: page } }, false);
				client.send({ page_create: { page: page, focus: true } });
			});
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
*/
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

