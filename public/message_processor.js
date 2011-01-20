MessageProcessor = {
	process: function(message) {
		for (var action in message) {
			this[action](message[action]);
		}
	},

	update_name: function(data) {
		display_name = data.new_name;
		reset_display_name();
	},

	connected: function() {
		$('#flash').html('');
	},

	announcement: function(data){
		$('#flash').append('<p><strong>' + data + '</strong></p>').scrollTop($('#flash').height());
	},

	message: function(data){
		$('#flash').append('<p>' + data + '</p>').scrollTop($('#flash').height());
	}
};
