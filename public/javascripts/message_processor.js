MessageProcessor = {
	error: function (message) {
		if (message == '404') {
			$('body').html('<div id="error_404"><p>Sorry, that project could not be found.</p><p><a href="/">Create a new project.</a></p><div>');
		} else {
			$('#flash').html('<p>Error: ' + message + '</p>');
		}
	},

	process: function (message) {
		for (var action in message) {
			if (this[action]) { this[action](message[action]); }
			else              { console.log("Undefined action: " + action); }
		}
	},

	// TODO rename this
	project_load: function (project) {
		$('#submit_password').dialog('destroy');
		env.project = new Project(project);
		env.project.sync_name();
		env.project.page_index();
		// fix this to select the page denoted in the hash if there is one
		// this needs to occur before current_page is reset (which occurs in page_index)
		jQuery.history.load(env.project.current_page_path());
		$('#project_display_name').val(project.name);
		show_connected_screen();
	},

	// User receives this action only when they were the one to create the project.
	project_create: function (created_project) {
		env.project.created = true;
		$('#projectinfo input').after('<img id="set_password" src="/images/lockicon.png">');
		$('#set_password').click(function () {
			var create_password = $('<div id="create_password"></div>').append('<div class="flash"></div><form></form>');

			create_password.find('form')
				.append('<label for="password">Password</label> <input type="password" id="password"> <br>')
				.append('<label for="password_confirm">Password Confirm</label> <input type="password" id="password_confirm"> <br>')
				.append('<input type="submit" value="Set Password">')
				.submit(function () {
					var password = $(this).find('#password').val();
					if (password != $(this).find('#password_confirm').val()) {
						$(this).siblings('.flash').html('').hide().html("<div class='active'>Your password confirmation does not match.</div>").fadeIn();
					} else {
						$(this).find('input').attr('disabled', 'disabled');
						env.socket.send({ project_update: { password: password } });
					}
					$('#password').focus();
					return false;
				});

			create_password.dialog({
				resizable: false,
				modal: true,
				title: 'Set a Password',
				zIndex: 10001,
			});
		});
	},
	
	project_prompt_password: function (data) {
		if (data.error) {
			$('#submit_password form').before('<div class="flash"><div class="active">' + data.error + '</div></div>').hide().fadeIn();
			$('input[type=password]').text('').focus();
			return;
		}
		$('#submit_password').dialog('destroy');
		var $submit_password = $("<div id='submit_password'></div>")
			.append("<form></form>")
			.dialog({
				resizable: false,
				modal: true,
				zIndex: 10001,
				title: 'Enter Password',
				minHeight: 50,
				closeOnEscape: false,
			})
			.find('form')
			.append('<label for="password">Password</label> <input type="password" id="password" > <br/>')
			.append('<input type="submit" value="Submit Password">')
			.submit(function () {
				var password = $(this).find('#password').val();
				$(this).siblings('.flash').remove();
				$(this).find('input').blur();
				var project_id = window.location.hash.split('/')[1];
				env.socket.send({ project_authorize: { id: project_id, password: password } });
				return false;
			});
		$('input[type=password]').focus();
		$('#connecting').dialog('destroy');
	},
	
	project_set_password: function (data) {
		if (data) {
			$('#create_password').dialog('destroy');
			$('#set_password').unbind('click').html('Password set.').fadeOut(5000);
		}
	},

	user_update: function (data) {
		env.display_name = data.name;
		reset_display_name();
	},

	project_update: function (data) {
		if (data.name) env.project.update_name(data);
	},

	page_update: function (data) {
		env.project.update_page_name(data.page);
	},

	page_delete: function (data) {
		delete env.project.pages[env.project.find_page_index_by_id(data.page._id)];
		env.project.page_index();
	},

	page_create: function (data) {
		if (typeof data.page.canvas_objects == 'undefined') data.page.canvas_objects = [];
		env.project.pages.push(data.page);
		if (data.focus) {
			env.project.current_page = env.project.pages[env.project.pages.length - 1]
			env.project.page_index();
			env.project.open_input_box($('.selected'));
		} else {
			env.project.page_index();
		}
	},

	canvas_object_create: function (data) {
		env.project.set_canvas_object(data.canvas_object);
	},

/*
	canvas_object_update: function (data) {
		env.project.set_canvas_object(data.canvas_object);
	},

	canvas_object_delete: function (data) {
		delete env.project.pages[data.canvas_object.page._id].canvas_objects[data.canvas_object._id];
		$('#canvas div[canvas_object_id=' + data.canvas_object._id + ']').remove();
	},
*/

	connected: function () {
	},

	message: function (data) {
		new Growl(data);
	},

};
