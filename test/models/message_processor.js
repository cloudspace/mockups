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


