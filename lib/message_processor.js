
var Project      = require('./project').Project;
//  , Page         = require('./page').Page
//  , CanvasObject = require('./canvas_object').CanvasObject;

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

  project_find: function (client, data) {
		Project.findById(data.id, function (err, project) {
      if (err || !project || project.hash != data.hash) {
        client.send({ error: '404' });
        return;
      }

			if (typeof project.password != 'undefined') {
				client.send({ project_prompt_password: true });
			} else {
				client.user.assign_project(project._id);
				client.send({ project_load: project.json });
			}
		});
  },

	project_create: function (client, data) {
		var project = new Project();
		project.pages.push({ name: 'Home', canvas_objects: [] });
		project.save(function (err) {
			if (err) {
				client.send({ error: err });
				return;
			}

			client.user.assign_project(project._id, true);
			client.send({ project_load: project, project_create: true });
		});
	},

	project_update: function (client, data) {
		Project.findById(client.user.project_id, function (err, project) {
			project.set(data);
			// Set the password and a salt if the client created the project
			if (data.password) client.user.created_project ? project.set_salt_and_password(data.password) : delete data.password;
			project.save(function (err) {
				if (err) {
					client.send({ error: err });
					return;
				}

				if (data.password) client.send({ project_set_password: true });
				client.user.broadcast_to_project({ project_update: data }, true);
				client.user.broadcast_to_project({ message: client.user.handle() + ' updated the project.'}, true);
			});
		});
	},

	project_authorize: function (client, data) {
		Project.findById(data.id, function (err, project) {
			if (project.authorize(data.password)) {
				client.user.assign_project(project._id);
				client.send({ project_load: project });
			} else {
				client.send({ project_prompt_password: { error: "Password was invalid."} });
			}
		});
	},

	// Allows a user to change their name.
	// Strips whitespace and html from the name.
	user_update: function (client, data) {
		if (typeof data.name != 'string') return false;
		data.name = data.name.esc();
		if (data.name == '' || data.name == client.user.name) return;

		client.user.name = data.name;
		client.send({ message: 'You successfully changed your display name to ' + data.name + '.', user_update: { name: data.name } });
		client.user.broadcast_to_project({ message: client.user.handle() + ' changed their display name to ' + data.name + '.' });
	},

	page_create: function (client, data) {
		Project.findById(client.user.project_id, function (err, project) {
			project.pages.push({ canvas_objects: [] });
			project.save(function (err) {
				if (err) {
					client.send({ error: err });
					return;
				}
				var page = project.pages[(project.pages.length - 1)].json;
				client.user.broadcast_to_project({ message: client.user.handle() + ' added a project page.' }, true);
				client.user.broadcast_to_project({ page_create: { page: page } }, false);
				client.send({ page_create: { page: page, focus: true } });
			});
		});
	},

	page_update: function (client, data) {
		if (data.page == undefined) {
			client.send({ error: 'Data needs a pages attribute.' });
			return;
		}

		Project.findById(client.user.project_id, function (err, project) {
			var page = project.pages.id(data.page._id);
			page.set(data.page);
			project.save(function (err) {
				if (err) {
					client.send({ error: err });
					return;
				}
				client.user.broadcast_to_project({ page_update: { page: page.json } }, true);
				client.user.broadcast_to_project({ message: client.user.handle() + ' renamed a project page.'}, true);
			});
		});
	},

	page_delete: function (client, data) {
		if (data.page == undefined) {
			client.send({ error: 'Data needs a pages attribute.' });
			return;
		}

		Project.findById(client.user.project_id, function (err, project) {
			var page = project.pages.id(data.page._id).remove();
			project.save(function (err) {
				if (err) {
					client.send({ error: err });
					return;
				}
				client.user.broadcast_to_project({ message: client.user.handle() + ' deleted a project page.' }, true);
				client.user.broadcast_to_project({ page_delete: { page: page.json } }, true);
			});
		});
	},

	canvas_object_create: function (client, data) {
		if (data.page == undefined) {
			client.send({ error: 'Data needs a pages attribute.' });
			return;
		}

		Project.findById(client.user.project_id, function (err, project) {
			var page = project.pages.id(data.page._id);
			page.canvas_objects.push(data.canvas_object);
			project.save(function (err) {
				if (err) {
					client.send({ error: err });
					return;
				}
				var canvas_object = page.canvas_objects[page.canvas_objects.length - 1];
				client.user.broadcast_to_project({ message: client.user.handle() + ' added element: ' + canvas_object.name + '.'}, true);
				client.user.broadcast_to_project({ canvas_object_create: { canvas_object: canvas_object.json } }, false);
				client.send({ canvas_object_create: { canvas_object: canvas_object.json, focus: true } });
			});
		});
	},

/*
	canvas_object_update: function (client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.'}); return; }
		Page.find_by_id_and_project_id(data.page.id, client.user.project_id, function (page) {
			CanvasObject.find(data.canvas_object.id, page, function (canvas_object) {
				if (canvas_object.error) return;
				canvas_object.update(data.canvas_object, function (canvas_object) {
					if (canvas_object.error) {
						client.send({ error: canvas_object.error });
						return;
					}
					client.user.broadcast_to_project({ message: client.user.handle() + ' updated element: ' + canvas_object.name() + '.'}, true);
					client.user.broadcast_to_project({ canvas_object_update: { canvas_object: canvas_object.json() } }, true);
				});
			});
		});
	},

	canvas_object_delete: function (client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.'}); return; }
		Page.find_by_id_and_project_id(data.page.id, client.user.project_id, function (page) {
			if (page.error) return;
			CanvasObject.find(data.canvas_object.id, page, function (canvas_object) {
				if (canvas_object.error) return;
				canvas_object.delete(function (deleted_canvas_object) {
					if (canvas_object.error) {
						client.send({ error: canvas_object.error });
					} else {
						var msg = { message: client.user.handle() + ' deleted element: ' + canvas_object.name() + '.'};
						client.user.broadcast_to_project(msg, true);
						client.user.broadcast_to_project({ canvas_object_delete: { canvas_object: canvas_object.json() } }, true);
					}
				});
			});
		});
	},
*/

	message: function (client, data) {
		var msg = {  message: client.user.handle() + data };
		client.user.broadcast_to_project(msg, true);
	},

};

// Our string escaper, which just trims and strips tags.
// TODO test
String.prototype.esc = function () {
	return this.trim().replace(/<[^>]*>?/g, '');
};

exports.MessageProcessor = MessageProcessor;

