MessageProcessor = {
	error: function(message) {
		if (message == '404') {
			$('body').html('<div id="error_404"><p>Sorry, that project could not be found.</p><p><a href="/">Create a new project.</a></p><div>');
		}
	},

	process: function(message) {
		for (var action in message) {
			if (this[action]){ this[action](message[action]); }
			else             { console.log("Undefined action: " + action);}
		}
	},

	load_project: function(project) {
		env.project = new Project(project);
		jQuery.history.load(env.project.path);
		$('#project_display_name').val(project.name);
	},

	update_name: function(data) {
		env.display_name = data.new_name;
		reset_display_name();
	},

	update_project: function(data) {
		env.project.update_name(data);
	},

	update_pages: function(data) {
		env.project.update_page_name(data);
	},

	connected: function() {
		$('#flash').html('');
	},

	announcement: function(data){
		$('#flash').html('<p><strong>' + data + '</strong></p>');
	},

	message: function(data){
		$('#flash').html('<p>' + data + '</p>');
	},

	add_page: function(data) {
		for (var key in data.page) {
			var page = key.split('.'); // server should send key in form: pages.3 (where 3 is the new page id)
			env.project.pages[page[1]] = data.page[key];
		}
		env.project.sync_pages();
		if (data.focus) $('#mockup_pages li:last input').focus();
	},

	delete_page: function(data) {
		for (var key in data.page) {
			var page = key.split('.'); // server should send key in form: pages.3 (where 3 is the new page id)
			delete env.project.pages[page[1]];
		}
		env.project.sync_pages();
	},
};
