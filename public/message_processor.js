MessageProcessor = {
	process: function(message) {
		$('#flash').scrollTop(1000000);
		for(action in message){
			console.log(message);
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
		$('#flash').append('<p><strong>' + data + '</strong></p>');
	},
	message: function(data){
		$('#flash').append('<p>' + data + '</p>');
	}
};
