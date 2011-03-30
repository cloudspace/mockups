MessageProcessor = {
	error: function(message) {
		if (message == '404') {
			$('body').html(Views.error_404());
		} else {
			$('#flash').html('<p>Error: ' + message + '</p>');
		}
	},

	process: function(message) {
		for (var action in message) {
			if (this[action]) { this[action](message[action]); }
			else              { console.log("Undefined action: " + action); }
		}
	},

	project_load: function(project) {
		$('.ui-dialog').remove();

		env.project = new Project(project);
		// set page items
		env.project.sync_mockup();
		jQuery.history.load(env.project.current_page_path());
		$('#project_display_name').val(project.name);
		initialize_name();
		show_connected_screen();
	},

	// User receives this action only when they were the one to create the project.
	project_create: function(created_project) {
		env.project.created = true;
		$('#projectinfo input').after('<img id="set_password" src="/images/lockicon.png">');
	},
	
	project_prompt_password: function(data) {
		if (data.error) {
			$('.flash').remove();
			$('#submit_password form').before('<div class="flash"><div class="active">' + data.error + '</div></div>').hide().fadeIn();
			$('input[type=password]').val('').focus();
			return;
		}

		$('.ui-dialog').remove();
		var $submit_password = $(Views.password_submit())
			.dialog({
				resizable: false,
				modal: true,
				zIndex: 10001,
				title: 'Enter Password',
				minHeight: 50,
				closeOnEscape: false,
			});
			
		$('input[type=password]').focus();
	},
	
	project_set_password: function(data) {
		if (data) {
			$('.ui-dialog').remove();
			$('#set_password').unbind('click').html('Password set.').fadeOut(5000);
		}
	},

	user_update: function(data) {
		env.display_name = data.name;
		reset_display_name();
	},

	project_update: function(data) {
		if (data.name) env.project.update_name(data);
	},

	page_update: function(data) {
		env.project.update_page_name(data.page);
	},

	page_delete: function(data) {
		delete env.project.pages[data.page.id];
		env.project.sync_pages();
	},

	page_create: function(data) {
		var page=data.page;

		env.project.pages[page.id] = page;
		if (data.focus) {
			// This should occur for the user who added the page.
			// Adds focus to the new page element.
			env.project.sync_pages(page.id);
			env.project.open_input_box($('.selected'));
		} else {
			// This should occur for users who did not add the page.
			// Just re-sync their page list and select whatever page they're already editing.
			env.project.sync_pages(env.project.current_page);
		}
	},

	canvas_object_create: function(data) {
		env.project.set_canvas_object(data.canvas_object);
	},

	canvas_object_update: function(data) {
		env.project.set_canvas_object(data.canvas_object);
	},

	canvas_object_delete: function(data) {
		for(var i in data.canvas_objects){
			delete env.project.pages[data.page_id].canvas_objects[data.canvas_objects[i].id];
			$('#canvas div[canvas_object_id=' + data.canvas_objects[i].id + ']').remove();
		}
	},

	connected: function() {
	},

	message: function(data) {
		new Growl(data);
	},

};
