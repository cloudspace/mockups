var
	assert 	= require('assert'),
	User		= require('../../lib/user').User,
  it      = require('../test_helper').it;

console.log("User");

it("instantiation fills default attributes", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	assert.equal('Anonymous', client.user.name);
	assert.equal(client.connection.remoteAddress, client.user.ip);
	assert.equal(client.user.project_id, undefined);
});

it("#handle: returns a user's name and IP address", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	client.user.name = 'Frank';
	assert.equal(client.user.handle(), 'Frank (127.0.0.1) ');
});

it("#assign_project: removes a user's current project and assigns one", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	client.user.assign_project(1);
	assert.equal(client.user.project_id, 1);
	client.user.assign_project(2);
	assert.equal(client.user.project_id, 2);
});

it("#assign_project: returns true when successful", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	assert.equal(client.user.assign_project(3), true);
	assert.equal(client.user.project_id, 3);
});

it("#assign_project: fails and returns false when not passed an id", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	assert.equal(client.user.assign_project(), false);
	assert.equal(client.user.project_id, undefined);
});

it("#subscribe: subscribes a User to a channel", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	client.subscribe(1);
	assert.equal(client.channels.indexOf(1), 0);
	//assert.equal(client.user.assign_project(), false);
});
// unsubscribe
// unsubscribe_all
// publish
// broadcast_to_project












