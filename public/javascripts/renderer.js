Renderer = {
	render: function(canvas_object){
		this.canvas_object = canvas_object;
		this.page_element = $('<div></div>')
			.addClass('canvas_object')
			.html(env.templates[canvas_object.template_id].render)
			.attr('canvas_object_id',canvas_object.id);

		//call specialized renderer if necessary
		if(this[canvas_object['template_id']]){ this[canvas_object['template_id']](); }

		if(canvas_object.left) { this.page_element.css('left',parseInt(canvas_object.left)); }
		if(canvas_object.top)  { this.page_element.css('top',parseInt(canvas_object.top)); }
		if(canvas_object.color){ this.page_element.css('color',canvas_object.color); }

		this.page_element.draggable({
		});

		return this.page_element.appendTo('#canvas');
	},
	paragraph: function() {
	}

};
