
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    Client           = require('../test_helper').Client,
    MessageProcessor = require('../../lib/message_processor').MessageProcessor;

exports.process = testCase({
	setUp: function (callback) {
		this.client = new Client;
		callback();
	},

	tearDown: function (callback) {
		delete this.client;
		callback();
	},

	'routes methods with appropriate data': function (test) {
		MessageProcessor.test = function(client, data){ client.zero = data; }; // Stub
		MessageProcessor.process(this.client, { test: 0 });
		test.equals(this.client.zero, 0);
		test.done();
	},

	'catches unknown methods': function(test) {
		test.doesNotThrow(function() {
			MessageProcessor.process(this.client, { test2: 0 })
		});
		test.done();
	},

	'create_project: creates a new project': function(test) {
		var that = this;
		MessageProcessor.process(this.client, { create_project: true });
		setTimeout(function() {
			test.equals(that.client.user.project_id, 'new');
			test.done();
		}, 10);
	},

});
/*


it("#process/update_name: changes a user's name", function() {
	MessageProcessor.process(client, { update_name: { new_name: 'Doug' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: strips html", function() {
	MessageProcessor.process(client, { update_name: { new_name: 'Doug<>' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: strips whitespace", function() {
	var client = new Client;

	MessageProcessor.process(client, { update_name: { new_name: '   Doug   ' } });
	assert.equal(client.user.name, 'Doug');
});

it("#process/update_name: does not update when nil", function() {
	var client = new Client;

	MessageProcessor.process(client, { update_name: { new_name: null } });
	assert.equal(client.user.name, 'Anonymous');
});


*/

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


