var
	assert           = require('assert'),
	MessageProcessor = require('../../lib/message_processor').MessageProcessor,
	User             = require('../../lib/user').User,
	it               = require('../test_helper').it;

console.log("MessageProcessor");

it("#process: routes methods with the appropriate data", function() {
	// TODO DRY these up.
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.test = function(client, data){ client.zero = data; }; // Stub
	MessageProcessor.process(client, { test: 0 });
	assert.equal(client.zero, 0);
});

it("#process: catches unknown methods", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	assert.doesNotThrow(function(){
		MessageProcessor.process(client, { test2: 0 })
	});
});

it("#process/update_name: changes a user's name", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: 'Doug' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: strips html", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: 'Doug<>' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: strips whitespace", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: '   Doug   ' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: does not update when nil", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: null } });
	assert.equal(client.user.name, 'Anonymous');
});

it("#process/create_project: adds user to 'new' project", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { create_project: true });
	assert.equal(client.user.project_id, 'new');
});

// TODO add tests that depend on mongodb when it's added
// These may need to be specced out further, and they will likely belong to a lib of their own.
//it("#process/find_project: returns a project when successfully found")
//it("#process/find_project: throws (or does not throw) an error if a project does not exist")

it("#process/find_project: adds user to an existing project", function() {
	var client  = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { find_project: { id: 'test' } });
	assert.equal(client.user.project_id, 'test');
});



