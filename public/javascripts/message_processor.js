MessageProcessor = {
	process: function(message) {
		for (var action in message) {
			this[action](message[action]);
		}
	},

	update_name: function(data) {
		env.display_name = data.new_name;
		reset_display_name();
	},

	connected: function() {
		$('#flash').html('');
	},

	announcement: function(data){
		$('#flash').html('<p><strong>' + data + '</strong></p>');
	},

	message: function(data){
		$('#flash').html('<p>' + data + '</p>');
	}
};
