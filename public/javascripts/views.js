
Views = {

	reconnect: function (initial_time) {
	 return '<div id="reconnect">' +
						'Attempting to reconnect in <span class="wait">' + initial_time + ' </span> seconds. <br><br>' +
						'<form onsubmit="env.initialize_reconnect(); return false;">' +
							'<input type="submit" value="Reconnect Now" />' +
						'</form>' +
					'</div>';
	},

	// Generates the dialog box for editing a canvas object
	canvas_object_edit: function (canvas_object_id) {
		var canvas_object = env.project.canvas_object(canvas_object_id),
				content       = get_canvas_object_content(canvas_object_id),
				html          = '<form canvas_object_id="'+ canvas_object_id +'" class="canvas_object_update">',
				attributes    = templates[canvas_object.template_id].attributes,
				$element      = $('.canvas_object[canvas_object_id=' + canvas_object_id + ']').find('.content');
	
		if (attributes.height) {
			html += '<label for="height">Height</label> ' +
				'<input id="height" name="height" value="' + (canvas_object.height || parseInt($element.css('height'))) + '" type="text"> px ' +
				'<br/>';
		}
		
		if (attributes.width) {
			html += '<label for="width">Width</label>' +
				'<input id="width" name="width" value="' + (canvas_object.width || parseInt($element.css('width'))) + '" type="text"> px ' +
				'<br/>';
		}

		if (attributes.fontsize) {
			html += '<label for="font-size">Font Size</label>' +
				'<input id="font-size" name="fontsize" type="text" value="' + (canvas_object.fontsize || parseInt($element.css('font-size'))) + '"> px ' +
				'<br/>';
		}
		if (attributes.content) {
			html += '<label for="content">Content</label>' +
				'<textarea id="content" name="content">' + content + '</textarea>' +
				'<br />';
		}
		html += '<input type="submit" value="Submit" class="rad5 submit">';
		html += '<a class="delete" href="javascript:">delete this object</a>';
		html += '</form>';

		return html;
	},

	connecting: function () {
		return '<div id="connecting"><div id="wait"></div><p>Connecting to the Cloudspace Mockups.</p></div>';
	},

	connected: function () {
		return '<div id="connected">' +
				'<p>Welcome to the <br/> Cloudspace Mockups<sup style="font-size: 8px; font-weight: bold;vertical-align:bottom;"> alpha </sup>!</p>' +
				'<form>' +
					'<input type="checkbox" id="closeconnect"> <label for="closeconnect">Close this automatically next time.</label><br>' +
					'<input type="submit" value="Start Mocking" class="start">' +
				'</form>' +
				'<p class="contribute"><a href="http://github.com/cloudspace/mockups">Want to contribute?</a></p>' +
			'</div>';
	},

	overlay: function () {
		var height = $("#canvas").height(), width = $("#canvas").width();
		return '<div id="overlay_wrapper" style="min-height: ' + height + 'px; min-width: ' + width + 'px;" class="overlay">&nbsp;</div>' +
		'<div id="overlay_contents" style="min-height: ' + height + 'px; min-width: ' + width + 'px;" class="overlay">' +
			'<img src="/images/overlay_image.png">' +
			'<h2 class="overlay_header">' +
				'Welcome to Cloudspace Mockups <a target="_blank" href="http://github.com/cloudspace/mockups">http://github.com/cloudspace/mockups</a>' +
			'</h2>' +
		'</div>';
	},

	page_listing: function(page) {
		//page_name = page.name ? page.name : '&nbsp;';
		return '<li>' +
		    '<form page_id="' + page._id + '" class="name_update">' +
					'<a page_id="' + page._id + '" id="page_' + page._id + '" ' +
					'   title="' + page.name.replace('"', '&quot;') + '" ' +
					'   href="#' + env.project.path + '/' + page._id + '">' +
						page.name +
					'</a>' +
					'<input class="h" type="text" value="' + page.name + '">' +
				'</form>' +
				'<span page_id="' + page._id + '" class="delete"> <img src="/images/deleteicon.png"/> </span>' +
			'</li>';
	},
}

