var Project      = require('./project').Project
, Page         = require('./page').Page
, CanvasObject = require('./canvas_object').CanvasObject;

var MessageProcessor = {

	// Routes messages to their appropriate processors.
	// So a message like { user_update: {} } should call
	// user_update() with the data keyed by user_update.
	process: function(client, message) {
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
			if (project.error || !project.validate_hash(data.hash)) { // Project not found or hash not valid 
				client.send({ error: project.error });
				return;
			}
			
			if (typeof project.password != 'undefined') {
				client.send({ project_prompt_password: true });
			} else {
				client.user.assign_project(project._id);
				client.send({ project_load: project });
			}
		});
	},

	project_authorize: function(client, data) {
		// authorize that the password matches the client's project
		Project.find_by_id(data.id, function(project) {
  		if (project.authorize(data.password)) {
				client.user.assign_project(project._id);
				client.send({ project_load: project });
			} else {
				client.send({ project_prompt_password: { error: "Password was invalid."} });
			}
		});
	},

	project_create: function(client, data) {
		Project.create(function(project) {
			if (project.error) { // Project not created for some reason...
				client.send({ error: project.error });
				return;
			}
			client.user.assign_project(project._id, true);
			client.send({ project_load: project, project_create: true });
		});
	},

	project_update: function(client, data) {
		if (data.password && !client.user.created_project) delete data.password;

		Project.find_by_id(client.user.project_id, function(project) {
			project.update(data, function(project) {
				if (project.error) {
					client.send({ error: project.error });
					return;
				}

				// lets the client know if she just set a password correctly
				if (project.$set.password) client.send({ project_set_password: true });

				client.user.broadcast_to_project({ project_update: data }, true);
				client.user.broadcast_to_project({ message: client.user.handle() + ' updated the project.'}, true);
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
			message: 'You successfully changed your display name to ' + data.name + '.',
			user_update: { name: data.name }
		});
		client.user.broadcast_to_project({ message: client.user.handle() + ' changed their display name to ' + data.name + '.' });

	},

	page_create: function(client, data) {
		Project.find_by_id(client.user.project_id, function(project) {
			Page.create(project, function(page) {
				if (page.error) {
					client.send({ error: page.error });
					return;
				}
				client.user.broadcast_to_project({ message: client.user.handle() + ' added a project page.'}, true);
				client.user.broadcast_to_project({ page_create: { page: page.json() } }, false);
				client.send({ page_create: { page: page.json(), focus: true } });
			});
		});
	},

	page_update: function(client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.'}); return; }
		Page.find_by_id_and_project_id(data.page.id, client.user.project_id, function(page) {
			if (page.error) return;
			page.update(data.page, function(page) {
				if (page.error) {
					client.send({ error: page.error });
					return;
				}
				client.user.broadcast_to_project({ page_update: { page: page.json() } }, true);
				client.user.broadcast_to_project({ message: client.user.handle() + ' renamed a project page.'}, true);
			});
		});
	},

	page_delete: function(client, data) {
		Page.find_by_id_and_project_id(data.page_id, client.user.project_id, function(page) {
			if (page.error) return;
			page.delete(function(page) {
				if (page.error) {
					client.send({ error: page.error });
				} else {
					client.user.broadcast_to_project({ message: client.user.handle() + ' deleted a project page.'}, true);
					client.user.broadcast_to_project({ page_delete: { page: page.json() } }, true);
				}
			});
		});
	},

	canvas_object_create: function(client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.' }); return; }
		Page.find_by_id_and_project_id(data.page.id, client.user.project_id, function(page) {
			CanvasObject.create(page, data, function(canvas_object) {
				if (canvas_object.error) {
					client.send({ error: canvas_object.error });
					return;
				}
				client.user.broadcast_to_project({ message: client.user.handle() + ' added element: ' + canvas_object.name() + '.'}, true);
				client.user.broadcast_to_project({ canvas_object_create: { canvas_object: canvas_object.json() } }, false);
				client.send({ canvas_object_create: { canvas_object: canvas_object.json(), focus: true } });
			});
		});
	},

	canvas_object_update: function(client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.'}); return; }
		Page.find_by_id_and_project_id(data.page.id, client.user.project_id, function(page) {
			CanvasObject.find(data.canvas_object.id, page, function(canvas_object) {
				if (canvas_object.error) return;
				canvas_object.update(data.canvas_object, function(canvas_object) {
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

	canvas_object_delete: function(client, data) {
		if (data.page == undefined) { client.send({ error: 'Data needs a pages attribute.'}); return; }
		Project.find_by_id(client.user.project_id, function(project){
			project.delete_canvas_objects(data.canvas_objects, data.page.id, function(canvas_object_ids){
				if (!canvas_object_ids['error']) {
					var name = canvas_object_ids.length == 1 ? 'a page element' : 'some page elements';
					client.user.broadcast_to_project({
						message: client.user.handle() + ' deleted ' + name + '.',
						canvas_object_delete: { page_id: data.page.id, canvas_objects: canvas_object_ids }
					}, true);
				}
			});

		});
	},

	message: function(client, data) {
		client.user.broadcast_to_project({ message: client.user.handle() + data }, true);
	},

};

// Our string escaper, which just trims and strips tags.
String.prototype.esc = function() {
	return this.trim().replace(/<[^>]*>?/g, '');
};

exports.MessageProcessor = MessageProcessor;

