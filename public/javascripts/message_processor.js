MessageProcessor = {
	error: function(message) {
	},

	process: function(message) {
		for (var action in message) {
			this[action](message[action]);
		}
	},

	load_project: function(project) {
		env.project = project;
		jQuery.history.load(project._id);
		$('#project_display_name').val(project.name);
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
