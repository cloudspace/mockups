Render = {
	render_object: function(canvas_object){
		return $('<div></div>')
			.addClass('canvas_object')
			.html(env.templates[canvas_object.template_id].render)
			.attr('canvas_object_id',canvas_object.id).appendTo('#canvas');

	},
	paragraph: function(canvas_object) {
		return this.render_object(canvas_object);
	}


};
