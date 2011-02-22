
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Client           = require('../test_helper').Client,
    Project          = require('../../lib/project').Project,
    Page             = require('../../lib/page').Page,
    CanvasObject     = require('../../lib/canvas_object').CanvasObject,
    MessageProcessor = require('../../lib/message_processor').MessageProcessor;

exports.process = testCase({

	setUp: function (callback) {
		// Set up a new [fake] client connection.
		this.client = new Client();
		// Clear out the projects collection.
		db.open(function(err, p_db) {
			db.dropCollection('projects', function(err) {
				callback();
			});
		});
	},

	tearDown: function (callback) {
		callback();
	},

	// creates a new generic process called 'test'
	// in order to check that process will hand off incoming data correctly
	"routes methods with appropriate data": function (test) {
		MessageProcessor.test = function(client, data){ client.zero = data; }; // Stub new process
		MessageProcessor.process(this.client, { test: 0 });
		test.equals(this.client.zero, 0);
		test.done();
	},

	"catches unknown methods": function(test) {
		test.doesNotThrow(function() {
			MessageProcessor.process(this.client, { test2: 0 })
		});
		test.done();
	},

	"project_find: sends client an error message if project is not found": function(test) {
		var that = this;
		MessageProcessor.process(this.client, { project_find: { id: '1', hash: '1' } });

		setTimeout(function() {
			test.notEqual(that.client.sent.error, undefined);
			test.done();
		}, 500);
	},

	"project_find: assigns user a project if it is found": function(test) {
		var that = this;
		Project.create(function(project) {
			MessageProcessor.process(that.client, { project_find: { id: project._id, hash: project.hash } });

			setTimeout(function() {
				test.notEqual(that.client.user.project_id, undefined);
				test.done();
			}, 500);
		});
	},

	"project_find: assigns user a project if it is authorized": function(test) {
		var that = this;
		Project.create(function(project) {
			MessageProcessor.process(that.client, { project_find: { id: project._id, hash: 'bad hash' } });

			setTimeout(function() {
				test.notEqual(that.client.sent.error, undefined);
				test.done();
			}, 500);
		});
	},

	"project_create: creates a project": function(test) {
		var that = this;
		MessageProcessor.process(this.client, { project_create: true });

		setTimeout(function() {
			db.open(function(err, p_db) {
				db.collection('projects', function(err, collection) {
					collection.count(function(err, count) {
						// If the count in our collection is 1,
						// then a new project must have been created.
						test.equals(count, 1);
						test.done();
					});
				});
			});
		}, 500);
	},

	"project_update: sends an error message when a project is not found": function(test) {
		var that = this;
		this.client.user.project_id = 5;
		MessageProcessor.process(this.client, { project_update: { name: 'Franklin' } });

		setTimeout(function(){
				test.notEqual(that.client.sent.error, undefined);
				test.done();
		}, 500);
	},

	"project_update: can update the project name": function(test) {
		var that = this;
		Project.create(function(project){
			that.client.user.project_id = project._id;
			MessageProcessor.process(that.client, { project_update: { name: 'Franklin' } });

			setTimeout(function(){
				Project.find_by_id(project._id, function (updated_project){
					test.notEqual(project.name, updated_project.name);
					test.done();
				});
			}, 500);
		});
	},

	"project_update: drops the password if the client did not create the project": function(test) {
		var that = this;
		Project.create(function(project){
			that.client.user.project_id = project._id;
			that.client.user.created_project = false;
			MessageProcessor.process(that.client, { project_update: { password: 'Franklin' } });

			setTimeout(function(){
				Project.find_by_id(project._id, function (updated_project){
					test.equal(updated_project.password, undefined);
					test.done();
				});
			}, 500);
		});
	},

	"project_update: sets the password if the client created the project": function(test) {
		var that = this;
		Project.create(function(project){
			that.client.user.project_id = project._id;
			that.client.user.created_project = true;
			MessageProcessor.process(that.client, { project_update: { password: 'Franklin' } });

			setTimeout(function(){
				Project.find_by_id(project._id, function (updated_project){
					test.notEqual(updated_project.password, undefined);
					test.notEqual(updated_project.salt, undefined);
					test.done();
				});
			}, 500);
		});
	},

	"page_create: adds a page to the project a user is on": function(test) {
		var that = this;
		Project.create(function(project) {
			that.client.user.project_id = project._id;
			MessageProcessor.process(that.client, { page_create: true });

			setTimeout(function() {
				test.equal(that.client.sent.error, undefined);
				test.notEqual(that.client.sent.page_create, undefined);
				test.done();
			}, 500);
		});
	},

	"page_update: sends an error message when a page is not found": function(test) {
		var that = this;
		this.client.user.project_id = 5;
		MessageProcessor.process(this.client, { page_update: { page: { name: 'Franklin' } } });

		setTimeout(function(){
				test.notEqual(that.client.sent.error, undefined);
				test.done();
		}, 500);
	},

	"page_update: can update the page name": function(test) {
		var that = this;
		Project.create(function(project){
			that.client.user.project_id = project._id;
			MessageProcessor.process(that.client, { page_update: { page: { id: 0, name: 'Franklin' } } });

			setTimeout(function(){
				Page.find_by_id_and_project_id(0, project._id, function (updated_page){
					test.equal(updated_page.name, 'Franklin');
					test.done();
				});
			}, 500);
		});
	},

	"page_delete: doesn't delete the final page": function(test) {
		var that = this;
		Project.create(function(project) {
			// asign client to project
			that.client.user.project_id = project._id;
			that.client.user.subscribe(project._id);
			// delete page
			MessageProcessor.process(that.client, { page_delete: { page_id: 0 } });

			setTimeout(function() {
				test.notEqual(that.client.sent.error, undefined);
				test.done();
			}, 500);
		});
	},

	"page_delete: deletes a page to the project a user is on": function(test) {
		var that = this;
		Project.create(function(project) {
			// assign client to project
			that.client.user.project_id = project._id;
			that.client.user.subscribe(project._id);
			Page.create(project, function(page){
				// delete page
				MessageProcessor.process(that.client, { page_delete: { page_id: 1 } });

				setTimeout(function() {
					test.equal(that.client.sent.error, undefined);
					test.notEqual(that.client.sent.page_delete, undefined);
					test.done();
				}, 500);
			});
		});
	},

	"canvas_object_create: adds a canvas object to the page a user passes": function(test) {
		var that = this;
		Project.create(function(project) {
			that.client.user.project_id = project._id;

			MessageProcessor.process(that.client, { canvas_object_create: { page: { id: 0 }, canvas_object: { top: 1, left: 2, template_id: 'header' } } });

			setTimeout(function() {
				test.equal(that.client.sent.error, undefined);
				test.notEqual(that.client.sent.canvas_object_create, undefined);
				test.done();
			}, 500);
		});
	},

	"canvas_object_update: sends an error message when a canvas object is not found": function(test) {
		var that = this;
		this.client.user.project_id = 5;
		MessageProcessor.process(this.client, { canvas_object_update: { page: { id: 0 }, canvas_object: { id: 1, top: 333 } } });

		setTimeout(function(){
				test.notEqual(that.client.sent.error, undefined);
				test.done();
		}, 500);
	},

	"canvas_object_update: sends an error message when a page is not found": function(test) {
		var that = this;
		this.client.user.project_id = 5;
		MessageProcessor.process(this.client, { canvas_object_update: { page: { id: 'not an id' }, canvas_object: { id: 1, top: 333 } } });

		setTimeout(function(){
				test.notEqual(that.client.sent.error, undefined);
				test.done();
		}, 500);
	},

	"canvas_object_update: can update the canvas object": function(test) {
		var that = this;
		Project.create(function(project) {
			that.client.user.project_id = project._id;
			Page.find_by_id_and_project_id(0, project._id, function(page) {
				CanvasObject.create(page, { canvas_object: { top: 10 } }, function(canvas_object) {
					MessageProcessor.process(that.client, { canvas_object_update: { page: { id: page.id }, canvas_object: { id: 0, top: 333 } } });

					setTimeout(function() {
						Page.find_by_id_and_project_id(0, project._id, function(page) {
							CanvasObject.find(0, page, function(updated_canvas_object) {
								test.equal(updated_canvas_object.top, 333);
								test.done();
							});
						});
					}, 500);
				});
			});
		});
	},

	"canvas_object_delete: deletes a canvas object to the project a user is on": function(test) {
		var that = this;
		Project.create(function(project) {
			// assign client to project
			that.client.user.project_id = project._id;
			that.client.user.subscribe(project._id);
			Page.create(project, function(page) {
				CanvasObject.create(page, { canvas_object: {} }, function(canvas_object) {
					// delete canvas object
					MessageProcessor.process(that.client, { canvas_object_delete: { page: { id: 1 }, canvas_object: { id: 0 } } });

					setTimeout(function() {
						test.equal(that.client.sent.error, undefined);
						test.notEqual(that.client.sent.canvas_object_delete, undefined);
						test.done();
					}, 500);
				});
			});
		});
	},

	"user_update: changes a user's name": function(test) {
		MessageProcessor.process(this.client, { user_update: { name: 'Doug' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"user_update: strips html": function(test) {
		MessageProcessor.process(this.client, { user_update: { name: 'Doug<>' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"user_update: strips whitespace": function(test) {
		MessageProcessor.process(this.client, { user_update: { name: '   Doug   ' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"user_update: does not update when nil": function(test) {
		MessageProcessor.process(this.client, { user_update: { name: null } });
		test.equals(this.client.user.name, 'Anonymous');
		test.done();
	},
});


