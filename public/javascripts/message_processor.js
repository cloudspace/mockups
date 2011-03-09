MessageProcessor = {
	error: function(message) {
		if (message == '404') {
			$('body').html('<div id="error_404"><p>Sorry, that project could not be found.</p><p><a href="/">Create a new project.</a></p><div>');
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
		$('#submit_password').dialog('destroy');

		env.project = new Project(project);
		// set page items
		env.project.sync_mockup();
		jQuery.history.load(env.project.current_page_path());
		$('#project_display_name').val(project.name);
	},

	// User receives this action only when they were the one to create the project.
	project_create: function(created_project) {
		env.project.created = true;
		$('#projectinfo input').after('<img id="set_password" src="/images/lockicon.png">');
		$('#set_password').click(function() {
			var create_password = $('<div id="create_password"></div>').append('<div class="flash"></div><form></form>');

			create_password.find('form')
				.append('<label for="password">Password</label> <input type="password" id="password"> <br>')
				.append('<label for="password_confirm">Password Confirm</label> <input type="password" id="password_confirm"> <br>')
				.append('<input type="submit" value="Set Password">')
				.submit(function() {
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
				zIndex: 9001,
			});
		});
	},
	
	project_prompt_password: function(data) {
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
				zIndex: 9001,
				title: 'Enter Password',
				minHeight: 50,
				closeOnEscape: false,
			})
			.find('form')
			.append('<label for="password">Password</label> <input type="password" id="password" > <br/>')
			.append('<input type="submit" value="Submit Password">')
			.submit(function() {
				var password = $(this).find('#password').val();
				$(this).siblings('.flash').remove();
				$(this).find('input').blur();
				var project_id = window.location.hash.split('/')[0].substring(1);
				env.socket.send({ project_authorize: { id: project_id, password: password } });
				return false;
			});
		$('input[type=password]').focus();
		$('#connecting').dialog('destroy');
	},
	
	project_set_password: function(data) {
		if (data) {
			$('#create_password').dialog('destroy');
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
		delete env.project.pages[data.canvas_object.page.id].canvas_objects[data.canvas_object.id];
		$('#canvas div[canvas_object_id=' + data.canvas_object.id + ']').remove();
	},

	connected: function() {
		if ($.cookie('skipconnect')) {
			$('#connecting').dialog('destroy');
		} else {
			$('#connecting')
				.html('<form><input type="checkbox" id="closeconnect"><label for="closeconnect">Close this automatically next time.</label><br><input type="submit" value="Start Mocking"></form>')
				.dialog('option', 'minHeight', 50)
				.dialog('option', 'closeOnEscape', true)
				.dialog('option', 'title', 'Connected')
				.find('form').submit(function() {
					var checked = $(this).find('input[type=checkbox]').attr('checked');
					if (checked) $.cookie('skipconnect', true);
					$('#connecting').dialog('destroy');
					return false;
				});
		}
	},

	announcement: function(data) {
		new Growl(data);
	},

	message: function(data) {
		new Growl(data);
	},

};
