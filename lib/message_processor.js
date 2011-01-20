var sys = module.parent.exports.sys
  , fs  = module.parent.exports.fs;

var MessageProcessor = {
	// TODO test
	process: function (client, message) {
		for (var action in message) {
			if (this[action]) {
				this[action](client, message[action]);
			} else {
				console.log("Undefined action: " + action);
			}
		}
	},

	update_name: function(client, data) {
		if (typeof data.new_name != 'string') return false;

		data.new_name = data.new_name.esc();
		if (data.new_name != '') {
			client.send({
				announcement: 'You successfully changed your display name to ' + data.new_name + '.',
				update_name: { new_name: data.new_name }
			});
			client.broadcast({
				announcement: client.user.handle() + ' changed their display name to ' + data.new_name + '.'
			});

			client.user.name = data.new_name;
		}
	},

	message: function(client, data){	
		var msg = {  message: client.user.handle() + data };
		client.broadcast(msg); // TODO change to associate to projects
		client.send(msg);
	},
};

// Our string escaper, which just trims and strips tags.
// TODO test
String.prototype.esc = function() {
	return this.trim().replace(/<[^>]*>?/g, '');
}

exports.MessageProcessor = MessageProcessor;

