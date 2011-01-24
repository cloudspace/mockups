var
	assert 	= require('assert'),
	Project = require('../../lib/project'),
	User		= require('../../lib/user').User,
  it      = require('../test_helper').it;

var
	client	= { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a" },
	user		= new User(client);

console.log("User");

it("instantiation fills default attributes", function() {
	assert.equal('Anonymous', user.name);
	assert.equal(client.connection.remoteAddress, user.ip);
	assert.equal(0, user.project_id);
});

it("#handle: returns a user's name and IP address", function() {
	assert.equal(user.handle(), 'Anonymous (127.0.0.1) ');
	user.name = 'Frank';
	assert.equal(user.handle(), 'Frank (127.0.0.1) ');
});

