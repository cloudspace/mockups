Renderer = {
	render: function(canvas_object) {
		this.canvas_object = canvas_object;
		// if this call gets something back then canvas_object exists
		this.page_element = $('#canvas div[canvas_object_id=' + canvas_object.id + ']');
		if (this.page_element.length == 0) {
			this.page_element =  $('<div></div>')
				.html(env.templates[canvas_object.template_id].render)
				.addClass('canvas_object')
				.attr('canvas_object_id', canvas_object.id)
				.css('position', 'absolute') 
				.draggable({
					containment: 'parent',
					opacity    : '0.6',
					snap       : '#canvas, #canvas .canvas_object',
					distance   : 0,
					//revert     : true,
					//revertDuration: 0,
					start      : function(event, ui) {
						$(this).addClass('ui-selected').siblings().removeClass('ui-selected');
					},
				});
		}

		// call specialized renderer if necessary
		if (this[canvas_object['template_id']]) { this[canvas_object['template_id']](); }

		if (canvas_object.left)  { this.page_element.css('left',parseInt(canvas_object.left)); }
		if (canvas_object.top)   { this.page_element.css('top',parseInt(canvas_object.top)); }
		if (canvas_object.color) { this.page_element.css('color',canvas_object.color); }


		return this.page_element.appendTo('#canvas');
	},
	render_helper: function(template_id) {
		return env.templates[template_id].render;
	},

	paragraph: function() {
	}
};

