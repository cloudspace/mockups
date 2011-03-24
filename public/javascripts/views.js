
Views = {

	reconnect: function(initial_time) {
	 return '<div id="reconnect">' +
						'Attempting to reconnect in <span class="wait">' + initial_time + ' </span> seconds. <br><br>' +
						'<form onsubmit="env.initialize_reconnect(); return false;">' +
							'<input type="submit" value="Reconnect Now" />' +
						'</form>' +
					'</div>';
	},

	// Generates the dialog box for editing a canvas object
	canvas_object_edit: function(canvas_object_id) {
		var canvas_object = env.project.canvas_object(canvas_object_id),
				content       = get_canvas_object_content(canvas_object_id),
				html          = '<form canvas_object_id="'+ canvas_object_id +'" class="canvas_object_update">',
				attributes    = templates[canvas_object.template_id].attributes,
				$element      = $('.canvas_object[canvas_object_id=' + canvas_object_id + ']').find('.content');
	
		if (attributes.height) {
			html += '<label for="height">Height <span class="unit">(px)</span></label> ' +
				'<input id="height" name="height" value="' + (canvas_object.height || parseInt($element.css('height'))) + '" type="text">' +
				'<br/>';
		}
		
		if (attributes.width) {
			html += '<label for="width">Width <span class="unit">(px)</span></label>' +
				'<input id="width" name="width" value="' + (canvas_object.width || parseInt($element.css('width'))) + '" type="text">' +
				'<br/>';
		}

		if (attributes.fontsize) {
			html += '<label for="font-size">Font Size <span class="unit">(px)</span> </label>' +
				'<input id="font-size" name="fontsize" type="text" value="' + (canvas_object.fontsize || parseInt($element.css('font-size'))) + '">' +
				'<br/>';
		}
		if (attributes.content) {
			html += '<label for="content">Content</label>' +
				'<textarea id="content" name="content">' + content + '</textarea>' +
				'<br />';
		}
		html += '<input type="submit" value="Apply" class="rad5 submit">' +
			'<a class="delete" href="javascript:">delete this object</a>' +
			'</form>';

		return html;
	},
	connecting: function(){
		return '<div id="connecting"><div id="wait"></div><p>Connecting to the Cloudspace Mockups.</p></div>';
	},
	connected: function(){
		var html = '<div id="connected" class="connected">' +
			'<p>Welcome to the <br/> Cloudspace Mockups<sup style="font-size: 8px; font-weight: bold;vertical-align:bottom;"> alpha </sup></p>' +
			'<ol>' +
			'<li>Save the url.  It\'s your only way to get back to this page!</li>' +
			'<li>Drag and drop elements on to the canvas.</li>' +
			'<li>The toolbar contains the page elements you will use.</li>' +
			'<li>Make a name, project password, and new pages in settings.</li>' +
			'</ol>' +
			'<form><input type="checkbox" id="closeconnect"><label for="closeconnect">Close this automatically next time.</label><br/>' +
			'<input type="submit" value="Start Mocking" class="start rad5" />' +
			'</form>' +
			'<p class="contribute"><a href="http://github.com/cloudspace/mockups">Want to contribute?</a></p>' +
			'</div>';
		return html;
	},
	error_404: function(){
		var html = '<div id="error_404">' +
			'<p>Sorry, that project could not be found.</p>' +
			'<p class="new_project"><a href="/" class="rad5">Create a new project.</a></p>' +
			'<div>';
		return html;
	},
	password_submit: function(){
		var html = '<div id="submit_password">' +
			'<form>' +
			'<label for="password">Password</label> <input type="password" id="password" /><br/>' +
			'<input type="submit" value="Submit Password" />' +
			'</form>' +
			'</div>';
		return html;
	},
	password_create: function(){
		var html = '<div id="create_password"><div class="flash"></div>' +
			'<form>' +
			'<label for="password">Password</label> <input type="password" id="password"/> <br/>' +
			'<label for="password_confirm">Password Confirm</label> <input type="password" id="password_confirm"/> <br/>' +
			'<input type="submit" value="Set Password"/>' +
			'<form>' +
			'</div>';
		return html;
	},
	page: function(index, page){
	  var page_name = page.name ? page.name.replace('"', '&quot;') : '&nbsp;';
		var html = '<li>' +
		  '<form page_id="' + index + '" class="name_update">' + // TODO remove h for current_page
			'<a page_id="' + index + '" id="page_' + index + '" ' +
			'   title="' + page_name + '" ' +
			'   href="#' + env.project.page_path(index) + '">' + page_name + '</a>' +
			'<input class="h" type="text" value="' + page_name + '"/>' +
			'</form>' +
			'<span page_id="' + index + '" class="delete"> <img src="/images/deleteicon.png"/> </span>' +
			'</li>';
			return html;
	},
}

