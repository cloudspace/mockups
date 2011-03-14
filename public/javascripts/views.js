
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
			html += '<label for="height">Height</label> ' +
				'<input id="height" name="height" value="' + (canvas_object.height || parseInt($element.css('height'))) + '" type="text"> px ' +
				'<br>';
		}

		if (attributes.width) {
			html += '<label for="width">Width</label>' +
				'<input id="width" name="width" value="' + (canvas_object.width || parseInt($element.css('width'))) + '" type="text"> px ' +
				'<br>';
		}

		if (attributes.fontsize) {
			html += '<label for="font-size">Font Size</label>' +
				'<input id="font-size" name="fontsize" type="text" value="' + (canvas_object.fontsize || parseInt($element.css('font-size'))) + '"> px ' +
				'<br>';
		}
		if (attributes.content) {
			html += '<label for="content">Content</label>' +
				'<textarea id="content" name="content">' + content + '</textarea>' +
				'<br />';
		}

		html += '<input type="submit" value="submit"> <input type="submit" class="delete" value="delete this object">'
		html += '</form>';

		return html;
	},

}

