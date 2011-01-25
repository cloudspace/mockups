var
	assert 	= require('assert'),
	it      = require('../test_helper').it,
	Client  = require('../test_helper').Client;

console.log("User");

it("instantiation fills default attributes", function() {
	var client = new Client;

	assert.equal('Anonymous', client.user.name);
	assert.equal(client.connection.remoteAddress, client.user.ip);
	assert.equal(client.user.project_id, undefined);
});

it("#handle: returns a user's name and IP address", function() {
	var client = new Client;

	client.user.name = 'Frank';
	assert.equal(client.user.handle(), 'Frank (127.0.0.1) ');
});

it("#assign_project: removes a user's current project and assigns one", function() {
	var client = new Client;

	client.user.assign_project(1);
	assert.equal(client.user.project_id, 1);
	client.user.assign_project(2);
	assert.equal(client.user.project_id, 2);
});

it("#assign_project: returns true when successful", function() {
	var client = new Client;

	assert.equal(client.user.assign_project(3), true);
	assert.equal(client.user.project_id, 3);
});

it("#assign_project: fails and returns false when not passed an id", function() {
	var client = new Client;

	assert.equal(client.user.assign_project(), false);
	assert.equal(client.user.project_id, undefined);
});

it("#subscribe: subscribes a User to a channel", function() {
	var client = new Client;

	client.user.subscribe(1);
	assert.equal(client.user.channels[1], true);
});

// This functionality isn't used, but it's possible.
it("#subscribe: can subscribe a User to multiple channels", function() {
	var client = new Client;

	client.user.subscribe(1);
	assert.equal(client.user.channels[1], true);
	client.user.subscribe(2);
	assert.equal(client.user.channels[2], true);
});

it("#unsubscribe: unsubscribes a User from a channel", function() {
	var client = new Client;

	client.user.subscribe(1);
	client.user.unsubscribe(1);
	assert.equal(client.user.channels[1], undefined);
});

it("#unsubscribe_all: unsubscribes a User from all channels", function() {
	var client = new Client;

	client.user.subscribe(1);
	client.user.subscribe(2);
	client.user.unsubscribe_all();
	assert.equal(client.user.channels[1], undefined);
	assert.equal(client.user.channels[2], undefined);
});

it("#publish: sends a message to users on a channel", function() {
	var client1 = new Client;
	client1.user.subscribe('dog');
	var client2 = new Client;
	client2.user.subscribe('dog');
	var data = { test: 'test' }

	client1.user.publish('dog', data);
	assert.equal(client2.sent, data);
});

it("#publish: does not send a message to users not on a channel", function() {
	var client1 = new Client;
	client1.user.subscribe('dog');
	var client2 = new Client;
	client2.user.subscribe('cat');
	var data = { test: 'test' }

	client1.user.publish('dog', data);
	assert.notEqual(client2.sent, data);
});

it("#publish: does not send a message to the user who published (when send_to_user is false)", function() {
	var client1 = new Client;
	client1.user.subscribe('dog');
	var client2 = new Client;
	client2.user.subscribe('cat');
	var data = { test: 'test' }

	client1.user.publish('dog', data, false);
	assert.notEqual(client1.sent, data);
});

it("#publish: sends a message to the user who published (when send_to_user is true)", function() {
	var client1 = new Client;
	client1.user.subscribe('dog');
	var client2 = new Client;
	client2.user.subscribe('cat');
	var data = { test: 'test' }

	client1.user.publish('dog', data, true);
	assert.equal(client1.sent, data);
});

it("#broadcast_to_project: publishes a message to everyone on a project", function() {
	var client1 = new Client;
	client1.user.assign_project(1);
	var client2 = new Client;
	client2.user.assign_project(1);
	var data = { test: 'test' }

	client1.user.broadcast_to_project(data);
	assert.equal(client2.sent, data);
});


