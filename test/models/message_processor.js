var
	assert 	= require('assert'),
	Project = require('../../lib/message_processor').MessageProcessor,
	//User		= require('../../lib/user').User,
  it      = require('../test_helper').it;

var
	client	= { connection: { remoteAddress: '127.0.0.1' },sessionId:"1a" },
	user		= new User(client);

console.log("Message Processor");

it("#update_name:  sends out an announcement to the the current user and all other users of the name change", function() {
	assert.equal( MessageProcessor.update_name(user.client, {new_name:"frank"}), '' );
});


