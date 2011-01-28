
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Client           = require('../test_helper').Client,
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
	//creates a new generic process called test in order to check that process will hand off incoming data correctly
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

	"create_project: creates a new project": function(test) {
		MessageProcessor.process(this.client, { create_project: true });

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

	"find_project: sends user an error message if project is not found": function(test) {
		var that = this;
		MessageProcessor.process(this.client, { find_project: { hash: '1' } });

		setTimeout(function() {
			test.notEqual(that.client.sent.error, undefined);
			test.done();
		}, 50);
	},

	"find_project: assigns user a project if it is found": function(test) {
		var that = this;
		db.open(function(err, p_db) {
			db.collection('projects', function(err, collection) {
				collection.insert({}, function(err, docs) {

					MessageProcessor.process(that.client, { find_project: { hash: docs[0]._id } });
					setTimeout(function() {
						test.notEqual(that.client.user.project_id, undefined);
						test.done();
					}, 50);

				}); 
			}); 
		}); 
	},


});


