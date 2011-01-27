
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
	  db               = require('../test_helper').db,
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

	"routes methods with appropriate data": function (test) {
		MessageProcessor.test = function(client, data){ client.zero = data; }; // Stub
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
		}, 10);
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

});

/*

// TODO add tests that depend on mongodb when it's added
// These may need to be specced out further, and they will likely belong to a lib of their own.
//it("#process/find_project: returns a project when successfully found")
//it("#process/find_project: throws (or does not throw) an error if a project does not exist")

it("#process/find_project: adds user to an existing project", function() {
	var client = new Client;

	MessageProcessor.process(client, { find_project: { id: 'test' } });
	assert.equal(client.user.project_id, 'test');
});

*/


