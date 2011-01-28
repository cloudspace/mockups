MessageProcessor = {
	error: function(message) {
		if (message == '404') {
			$('body').html('<div id="error_404"><p>Sorry, that project could not be found.</p><p><a href="/">Create a new project.</a></p><div>');
		}
	},

	process: function(message) {
		for (var action in message) {
			this[action](message[action]);
		}
	},

	load_project: function(project) {
		env.project = new Project(project);
		jQuery.history.load(project._id);
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
