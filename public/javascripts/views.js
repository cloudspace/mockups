
Views = {

	canvas_object_edit: function(canvas_object_id) {
		var canvas_object = env.project.canvas_object(canvas_object_id);
		var content = get_canvas_object_content(canvas_object_id);
		var html = '<form canvas_object_id="'+ canvas_object_id +'" class="canvas_object_update">';
		var template = templates[canvas_object.template_id];

		if (template.attributes.height)   html += "<label for='height'>Height</label><input id='height' name='height' value='" + (canvas_object.height || "") + "'type='text'/><br />";
		if (template.attributes.width)    html += "<label for='width'>Width</label><input id='width' name='width' value='" + (canvas_object.width || "") + "'type='text'/><br />";
		if (template.attributes.fontsize) html += "<label for='font-size'>Font Size</label><input id='font-size' name='fontsize' type='text' value='" + (canvas_object.fontsize || "") + "'/><br />";
		if (template.attributes.content)  html += "<label for='content'>Content</label><textarea id='content' name='content'>" + content + "</textarea><br />";
		html += "<input type='submit' value='submit'/><input type='submit' class='delete' value='delete this object' />"
		html += "</form>";

		return html;
	},

}

