Renderer = {
	render: function(canvas_object) {
		this.canvas_object = canvas_object;
		this.content = canvas_object.content ? canvas_object.content : env.templates[canvas_object.template_id].render;
		var rendered_content;

		if (this[canvas_object['template_id']]) { rendered_content = this[canvas_object['template_id']](); }
		// if this call gets something back then canvas_object exists
		this.page_element = $('#canvas div[canvas_object_id=' + canvas_object.id + ']');
		if (this.page_element.length == 0) {//object not rendered
			this.page_element =  $('<div></div>')
				.html(rendered_content)
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
		}else{
			this.page_element.html(rendered_content);
		}


		if (canvas_object.left)  { this.page_element.css('left',parseInt(canvas_object.left)); }
		if (canvas_object.top)   { this.page_element.css('top',parseInt(canvas_object.top)); }
		if (canvas_object.color) { this.page_element.css('color',canvas_object.color); }


		return this.page_element.appendTo('#canvas');
	},
	render_helper: function(template_id) {
		this.content = env.templates[template_id].render;
		return this[template_id]();
	},
	heading: function() {
		return "<h1>"+ this.content +"</h1>";
	},
	paragraph: function() {
		return "<p>"+ this.content +"</p>";
	},
	link: function() {
		return "<span class='link'>"+ this.content +"</span>";
	},
	list: function() {
		var list_items = "";
		this.content.split("\n").forEach( function(value){ list_items += "<li>"+value+"</li>"});
		return "<ul type='bulleted'>"+ list_items +"</ul>";
	},
	image: function() {
		return "<img class='image' src='"+ this.content +"' alt='Image Placeholder' />";
	},
	textarea: function() {
		return "<textarea>"+ this.content +"</textarea>";
	},
	input_box: function(){
		return "<input type='text' class='inputbox' value='Input Box'/>";
	},
	check_box: function(){
		return "<form><input type='checkbox' class='check_item'/><label>"+ this.content +"</label></form>";
	},
	radio_buttons: function(){
		var radio_buttons = "";
		this.content.split("\n").forEach( 
			function(value){ radio_buttons += "<input type='radio' name='radio'/><label>"+ value +"</label><br/>"}
		);
    return "<form>" + radio_buttons + "</form>";
	},
	table: function() {
		var trs = "";
		this.content.split("\n").forEach( function(value){ trs += "<tr><td>"+ value +"</td></tr>"});
		return "<table><tbody>"+ trs +"</tbody></table>";
	},
	submit_button: function(){
		return "<div class='white button'>"+ this.content + "</div>";
	},
	select_menu: function() {
		return "<select><option value=''>"+ this.content +"</option></select>";
	},
	global_container: function(){
		return "<div class='global_container'>"+ this.content +"</div>";
	},
	main_navigation: function(){
		return "<ul class='nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
	},
	user_navigation: function(){
		return "<ul class='user_nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
	},
	footer_navigation: function(){
		return "<ul class='footer_nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
	},
	box_container: function(){
		return "<div class='box'>"+ this.content +"</div>";
	},
	vertical_line: function(){
		return "<div class='verLine'></div>";
	},
	horizontal_line: function(){
		return "<div class='horLine'></div>";
	}	
	

};

