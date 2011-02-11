Renderer = {
	render: function(canvas_object){
		this.canvas_object = canvas_object;
		//if this call gets something back then canvas_object exists
		this.page_element = $('#canvas div[canvas_object_id='+ canvas_object.id +']');
		if(this.page_element.length == 0){
			this.page_element = $('<div></div>')
				.addClass('canvas_object')
				.html(env.templates[canvas_object.template_id].render)
				.css('position','absolute')
				.attr('canvas_object_id',canvas_object.id);
			this.page_element.draggable({
			'containment': 'parent',
			'opacity'    : '0.6',
			'snap'       : '#canvas, #canvas .canvas_object'
			});
		}
		//call specialized renderer if necessary
		if(this[canvas_object['template_id']]){ this[canvas_object['template_id']](); }

		if(canvas_object.left) { this.page_element.css('left',parseInt(canvas_object.left)); }
		if(canvas_object.top)  { this.page_element.css('top',parseInt(canvas_object.top)); }
		if(canvas_object.color){ this.page_element.css('color',canvas_object.color); }


		return this.page_element.appendTo('#canvas');
	},
	paragraph: function() {
	}

};
