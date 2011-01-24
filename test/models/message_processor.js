var
	assert           = require('assert'),
	MessageProcessor = require('../../lib/message_processor').MessageProcessor,
	User             = require('../../lib/user').User,
	it               = require('../test_helper').it;

console.log("MessageProcessor");

it("#process/update_name: changes a user's name", function() {
	var client      = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: 'Doug' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: strips html", function() {
	var client      = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: 'Doug<>' } });
	assert.equal(client.user.name, 'Doug');
});


it("#process/update_name: strips whitespace", function() {
	var client      = { connection: { remoteAddress: '127.0.0.1' }, sessionId: "1a", send: function(){} };
	client.user = new User(client);

	MessageProcessor.process(client, { update_name: { new_name: '   Doug   ' } });
	assert.equal(client.user.name, 'Doug');
});



