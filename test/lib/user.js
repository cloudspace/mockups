var testCase         = require('nodeunit').testCase,
	  db               = require('../test_helper').db,
    Client           = require('../test_helper').Client;

exports.user = testCase({

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

	"handle: returns a user's name and IP address": function(test) {
		this.client.user.name = 'Frank';
		test.equals(this.client.user.handle(), 'Frank (127.0.0.1) ');
		test.done();
	},

	"assign_project: removes a user's current project and assigns one": function(test) {
		this.client.user.assign_project(1);
		test.equals(this.client.user.project_id, 1);
		this.client.user.assign_project(2);
		test.equals(this.client.user.project_id, 2);
		test.done();
	},

	"assign_project: returns true when successful": function(test) {
		test.equals(this.client.user.assign_project(3), true);
		test.equals(this.client.user.project_id, 3);
		test.done();
	},

	"assign_project: fails and returns false when not passed an id": function(test) {
		test.equals(this.client.user.assign_project(), false);
		test.equals(this.client.user.project_id, undefined);
		test.done();
	},

	"assign_project: sets created_project to true when second argument passed is true": function(test) {
		this.client.user.assign_project(3, true);
		test.equals(this.client.user.created_project, true);
		test.done();
	},

	"assign_project: sets created_project to false when no second argument is passed": function(test) {
		this.client.user.assign_project(3);
		test.equals(this.client.user.created_project, false);
		test.done();
	},

	"subscribe: subscribes a User to a channel": function(test) {
		this.client.user.subscribe(1);
		test.equals(this.client.user.channels[1], true);
		test.done();
	},

	// This functionality isn't used, but it's possible.
	"subscribe: can subscribe a User to multiple channels": function(test) {
		this.client.user.subscribe(1);
		test.equals(this.client.user.channels[1], true);
		this.client.user.subscribe(2);
		test.equals(this.client.user.channels[2], true);
		test.done();
	},

	"unsubscribe: unsubscribes a User from a channel": function(test) {
		this.client.user.subscribe(1);
		this.client.user.unsubscribe(1);
		test.equals(this.client.user.channels[1], undefined);
		test.done();
	},

	"unsubscribe_all: unsubscribes a User from all channels": function(test) {
		this.client.user.subscribe(1);
		this.client.user.subscribe(2);
		this.client.user.unsubscribe_all();
		test.equals(this.client.user.channels[1], undefined);
		test.equals(this.client.user.channels[2], undefined);
		test.done();
	},

	"publish: sends a message to users on a channel": function(test) {
		var client1 = new Client;
		client1.user.subscribe('dog');
		var client2 = new Client;
		client2.user.subscribe('dog');
		var data = { test: 'test' }

		client1.user.publish('dog', data);
		test.equals(client2.sent, data);
		test.done();
	},

	"publish: does not send a message to users not on a channel": function(test) {
		var client1 = new Client;
		client1.user.subscribe('dog');
		var client2 = new Client;
		client2.user.subscribe('cat');
		var data = { test: 'test' }

		client1.user.publish('dog', data);
		test.notEqual(client2.sent, data);
		test.done();
	},

	"publish: does not send a message to the user who published (when send_to_user is false)": function(test) {
		var client1 = new Client;
		client1.user.subscribe('dog');
		var client2 = new Client;
		client2.user.subscribe('cat');
		var data = { test: 'test' }

		client1.user.publish('dog', data, false);
		test.notEqual(client1.sent, data);
		test.done();
	},

	"publish: sends a message to the user who published (when send_to_user is true)": function(test) {
		var client1 = new Client;
		client1.user.subscribe('dog');
		var client2 = new Client;
		client2.user.subscribe('cat');
		var data = { test: 'test' }

		client1.user.publish('dog', data, true);
		test.equals(client1.sent, data);
		test.done();
	},

	"broadcast_to_project: publishes a message to everyone on a project": function(test) {
		var client1 = new Client;
		client1.user.assign_project(1);
		var client2 = new Client;
		client2.user.assign_project(1);
		var data = { test: 'test' }

		client1.user.broadcast_to_project(data);
		test.equals(client2.sent, data);
		test.done();
	},

});

