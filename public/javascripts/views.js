
Views = {

	reconnect: function(initial_time) {
		return '<div id="reconnect">' +
			'Attempting to reconnect in <span class="wait">' + initial_time + ' </span> seconds. <br><br>' +
			'<form onsubmit="env.initialize_reconnect(); return false;">' +
			'<input class="rad5 ui_button" type="submit" value="Reconnect Now" />' +
			'</form>' +
			'</div>';
	},

	// Generates the dialog box for editing a canvas object
	canvas_object_edit: function(canvas_object_id) {
		var canvas_object = env.project.canvas_object(canvas_object_id)
		, content       = get_canvas_object_content(canvas_object_id)
		, html          = '<form canvas_object_id="'+ canvas_object_id +'" class="canvas_object_update">'
		, attributes    = templates[canvas_object.template_id].attributes
		, $element      = $('.canvas_object[canvas_object_id=' + canvas_object_id + ']').find('.content');
	
		if (attributes.height) {
			html += '<label for="height">Height <span class="unit">(px)</span></label> ' +
				'<input id="height" name="height" value="' + (canvas_object.height || parseInt($element.css('height'))) + '" type="text">' +
				'<br>';
		}
		
		if (attributes.width) {
			html += '<label for="width">Width <span class="unit">(px)</span></label>' +
				'<input id="width" name="width" value="' + (canvas_object.width || parseInt($element.css('width'))) + '" type="text">' +
				'<br>';
		}

		if (attributes.fontsize) {
			html += '<label for="font-size">Font Size <span class="unit">(px)</span> </label>' +
				'<input id="font-size" name="fontsize" type="text" value="' + (canvas_object.fontsize || parseInt($element.css('font-size'))) + '">' +
				'<br>';
		}

		if (attributes.content) {
			html += '<label for="content">Content</label>' +
				'<textarea id="content" name="content">' + content + '</textarea>' +
				'<br>';
		}

		html += '<input type="submit" value="Apply" class="rad5 ui_button">' +
			'<a class="delete" href="javascript:">delete this object</a>' +
			'</form>';

		return html;
	},

	connecting: function(){
		return '<div id="connecting"><div id="wait"></div><p>Connecting to the Cloudspace Mockups.</p></div>';
	},

	connected: function(){
		return '<div id="connected" class="connected">' +
			'<h2>Cloudspace Mockups <sup>alpha</sup></h2>' +
			'<ol>' +
			'<li class="rad5"><span class="number">1</span> Save the <strong>url</strong>.  It\'s your only way to get back to this page!' +
			'<div class="instructional_marker first">1 <span>URL</span></div></li>' +
			'<li class="rad5"><span class="number">2</span> The <strong>toolbar</strong> contains the page elements you will use.' +
			'<div class="instructional_marker second">2 <span>Tools</span></div></li>' +
			'<li class="rad5"><span class="number">3</span> Drag and drop elements on to the <strong>canvas</strong>.' +
			'<div class="instructional_marker third">3 <span>Canvas</span></div></li>' +
			'<li class="rad5"><span class="number">4</span> Set a name, project password, and new pages in <strong>settings</strong>.' +
			'<div class="instructional_marker fourth">4 <span>Settings</span></div></li>' +
			'</ol>' +
			'<div class="clear"></div>' +
			'<form>' +
			'<input type="submit" value="Start Mocking" class="start rad5" /><br/>' +
			'<div><p class="hide_dialog"><input type="checkbox" ' + ($.cookie('skipconnect') == 'true' ? 'checked="checked"' : '') + ' id="closeconnect"><label for="closeconnect">Close this next time.</label></p>' +
			'<p class="contribute"><a target="_blank" href="http://github.com/cloudspace/mockups">Want to contribute?</a></p></div>' +
			'</form>' +
			'</div>';
	},
	error_404: function(){
		return '<div id="error_404">' +
			'<p>Sorry, that project could not be found.</p>' +
			'<p class="new_project"><a href="/" class="rad5 light_button">Create a new project.</a></p>' +
			'<div>';
	},
	password_submit: function(){
		return '<div id="submit_password">' +
			'<form>' +
			'<label for="password">Password</label> <input type="password" id="password" /><br/>' +
			'<input type="submit" value="Submit Password" />' +
			'</form>' +
			'</div>';
	},
	password_create: function(){
		return '<div id="create_password"><div class="flash"></div>' +
			'<form>' +
			'<label for="password">Password</label> <input type="password" id="password"/> <br/>' +
			'<label for="password_confirm">Password Confirm</label> <input type="password" id="password_confirm"/> <br/>' +
			'<input type="submit" value="Set Password"/>' +
			'<form>' +
			'</div>';
	},
	page: function(index, page){
		var page_name = page.name ? page.name.replace('"', '&quot;') : '&nbsp;';
		return '<li>' +
			'<form page_id="' + index + '" class="name_update">' + // TODO remove h for current_page
			'<a page_id="' + index + '" id="page_' + index + '" ' +
			'   title="' + page_name + '" ' +
			'   href="#' + env.project.page_path(index) + '">' + page_name + '</a>' +
			'<input class="h" type="text" value="' + page_name + '"/>' +
			'</form>' +
			'<span page_id="' + index + '" class="delete"> <img src="/images/deleteicon.png"/> </span>' +
			'</li>';
	},
}

