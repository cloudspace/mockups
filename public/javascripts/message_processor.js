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
		jQuery.history.load(env.project.current_page_path());
		$('#project_display_name').val(project.name);
	},

	user_update: function(data) {
		env.display_name = data.name;
		reset_display_name();
	},

	project_update: function(data) {
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

 // server should send key in form: pages.3 (where 3 is the new page id)
	add_page: function(data) {
		var page_id;
		for (var key in data.page) {
			var page = key.split('.');
			page_id = page[1];
			env.project.pages[page[1]] = data.page[key];
		}

		if (data.focus) {
			// This should occur for the user who added the page.
			// Adds focus to the new page element.
			env.project.sync_pages(page_id);
			env.project.open_input_box($('.selected'));
		} else {
			// This should occur for users who did not add the page.
			// Just re-sync their page list and select whatever page they're already editing.
			env.project.sync_pages(env.project.current_page);
		}

	},

	delete_page: function(data) {
		for (var key in data.page) {
			var page = key.split('.'); // server should send key in form: pages.3 (where 3 is the new page id)
			delete env.project.pages[page[1]];
		}
		env.project.sync_pages();
	},
};
