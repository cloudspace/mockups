
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Client           = require('../test_helper').Client,
    Project          = require('../../lib/project').Project,
    MessageProcessor = require('../../lib/message_processor').MessageProcessor;

exports.process = testCase({

	setUp: function (callback) {
		// Set up a new [fake] client connection.
		this.client = new Client;
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
		}, 50);
	},

	"project_find: assigns user a project if it is found": function(test) {
		var that = this;
		Project.create(function(project) {
			MessageProcessor.process(that.client, { project_find: { id: project._id, hash: project.hash } });
			setTimeout(function() {
				test.notEqual(that.client.user.project_id, undefined);
				test.done();
			}, 50);
		});
	},

	"project_find: assigns user a project if it is authorized": function(test) {
		var that = this;
		Project.create(function(project) {
			MessageProcessor.process(that.client, { project_find: { id: project._id, hash: 'bad hash' } });
			setTimeout(function() {
				test.notEqual(that.client.sent.error, undefined);
				test.done();
			}, 50);
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
		}, 50);
	},

/*
	"update_name: changes a user's name": function(test) {
		MessageProcessor.process(this.client, { update_name: { new_name: 'Doug' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"update_name: strips html": function(test) {
		MessageProcessor.process(this.client, { update_name: { new_name: 'Doug<>' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"update_name: strips whitespace": function(test) {
		MessageProcessor.process(this.client, { update_name: { new_name: '   Doug   ' } });
		test.equals(this.client.user.name, 'Doug');
		test.done();
	},

	"update_name: does not update when nil": function(test) {
		MessageProcessor.process(this.client, { update_name: { new_name: null } });
		test.equals(this.client.user.name, 'Anonymous');
		test.done();
	},

	"add_page: adds a page to the project a user is on": function(test) {
		var that = this;
		new Project(function(project) {
			// asign client to project
			MessageProcessor.process(that.client, { find_project: { id: project._id, hash: project.hash } });
			setTimeout(function() {
				// add page
				MessageProcessor.process(that.client, { add_page: true });
				setTimeout(function() {
					test.equal(that.client.sent.error, undefined);
					test.notEqual(that.client.sent.add_page, undefined);
					test.done();
				}, 50);
			}, 50);
		});
	},

	"delete_page: deletes a page to the project a user is on": function(test) {
		var that = this;
		new Project(function(project) {
			// asign client to project
			MessageProcessor.process(that.client, { find_project: { id: project._id, hash: project.hash } });
			setTimeout(function() {
				// add a page
				Project.add_page(project._id, function() {
					// delete page
					MessageProcessor.process(that.client, { delete_page: { page_id: 0 } });
					setTimeout(function() {
						test.equal(that.client.sent.error, undefined);
						test.notEqual(that.client.sent.delete_page, undefined);
						test.done();
					}, 50);
				});
			}, 50);
		});
	},

	"delete_page: doesn't delete the final page": function(test) {
		var that = this;
		new Project(function(project) {
			// asign client to project
			MessageProcessor.process(that.client, { find_project: { id: project._id, hash: project.hash } });
			setTimeout(function() {
				// delete page
				MessageProcessor.process(that.client, { delete_page: { page_id: 0 } });
				setTimeout(function() {
					test.notEqual(that.client.sent.error, undefined);
					test.equal(that.client.sent.delete_page, undefined);
					test.done();
				}, 50);
			}, 50);
		});
	},

	"update_project: sends an error message when a project is not found ": function(test) {
		var that = this;
		MessageProcessor.process(this.client, { update_project: { id: '1', hash: '1', name: 'Franklin' } });

		setTimeout(function(){
				test.notEqual(that.client.sent.error, undefined);
				test.done();
		}, 50);
	},

	"update_project: can update the project name": function(test) {
		var that = this;
		new Project(function(project){
			var old_project = project;
			MessageProcessor.process(that.client, { update_project: { id: project._id, hash: project.hash, name: 'Franklin' } });
			setTimeout(function(){
				Project.find({ id: project._id, hash: project.hash}, function (err, new_project){
					test.notEqual(new_project.name, undefined);
					test.notEqual(project.name, new_project.name);
					test.done();
				});
			}, 50);
		});
	},

	"update_project: can update the project pages": function(test) {
		var that = this;
		new Project(function(project){
			var old_project = project;
			MessageProcessor.process(that.client, {
					update_project: {
						id: project._id, hash: project.hash,
						pages : {
							'0': { name: 'test', mockup_objects: {} }
						}
					}
				});

			setTimeout(function(){
				Project.find({ id: project._id, hash: project.hash}, function (err, new_project){
				test.notEqual(project.pages['0'].name, new_project.pages['0'].name);

				test.done();
				});
			}, 50);
		});
	}
*/

});


