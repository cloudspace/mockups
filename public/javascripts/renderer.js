Renderer = {
	render: function(canvas_object) {
		this.canvas_object = canvas_object;
		this.content = canvas_object.content ? canvas_object.content : templates[canvas_object.template_id].default_content;
		var rendered_content;

		if (this[canvas_object['template_id']]) { rendered_content = this[canvas_object['template_id']](); }
		// if this call gets something back then canvas_object exists
		this.page_element = $('#canvas .canvas_object[canvas_object_id=' + canvas_object.id + ']');

		if (this.page_element.length == 0) { //object not rendered
			this.page_element =  $('<div></div>')
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
		
		this.page_element.html(rendered_content);
		if (templates[canvas_object.template_id].resizable_options) {
			this.page_element.resizable('destroy').resizable(templates[canvas_object.template_id].resizable_options);
		}

		if (canvas_object.left)   { this.page_element.css('left',parseInt(canvas_object.left)); }
		if (canvas_object.top)    { this.page_element.css('top',parseInt(canvas_object.top)); }
		if (canvas_object.width)  { this.page_element.width(parseInt(canvas_object.width)); }
		if (canvas_object.height) { this.page_element.height(parseInt(canvas_object.height)); }

		return this.page_element.appendTo('#canvas');
	},

	resize: function($canvas_object) {
		env.socket.send({
			canvas_object_update: {
				canvas_object: {
					width:       $canvas_object.width(),
					height:      $canvas_object.height(),
					id:          $canvas_object.attr('canvas_object_id'),
				},
				page:        { id: env.project.current_page }
			}
		});
		return false;	
	},

	render_helper: function(template_id) {
		this.content = templates[template_id].default_content;
		return this[template_id]();
	},

	heading: function() {
		return "<h1>"+ this.content +"</h1>";
	},

	paragraph: function() {
		return "<p>"+ this.content.split("\n").join("<br/>") +"</p>";
	},

	link: function() {
		var page_id = env.project.find_page_id_by_name(this.content);
		var page_id_attr = typeof page_id == "undefined" ? "" : "page_id='"+ page_id +"'";
		return "<span "+ page_id_attr + " class='link'>"+ this.content +"</span>";
	},

	list: function() {
		var list_items = "";
		this.parse_items(this.content, function(item){ list_items += "<li>"+ item +"</li>"});
		return "<ul type='bulleted'>"+ list_items +"</ul>";
	},

	image: function() {
		return "<img class='image' src='/images/picture.png' alt='Image Placeholder' />";
	},

	textarea: function() {
		return "<textarea>"+ this.content +"</textarea>";
	},

	input_box: function(){
		return "<input type='text' class='inputbox' value='"+ this.content +"'/>";
	},

	submit_button: function(){
		return "<div class='white button'>"+ this.content + "</div>";
	},

	select_menu: function() {
		return "<select><option value=''>"+ this.content +"</option></select>";
	},

	radio_buttons: function(){
		var radio_buttons = "";
		this.parse_items(this.content ,function(item, is_special){
			checked = is_special ? "checked='checked'": "";
			radio_buttons += "<input type='radio' "+ checked  +"name='radio'/> <label>"+ item +"</label><br/>";
		});
    return "<form>" + radio_buttons + "</form>";
	},

	check_box: function(){
		var check_boxes = "";
		this.parse_items(this.content, function(item, is_special){
			checked = is_special ? "checked='checked'": "";
			check_boxes += "<input type='checkbox' "+ checked  +"name='checks'/><label>"+ item +"</label><br/>";
		});
		return "<form>" + check_boxes + "</form>";
	},

	box_container: function(){
		return "<div class='box'>"+ this.content +"</div>";
	},

	vertical_line: function(){
		return "<div class='verLine'></div>";
	},

	horizontal_line: function(){
		return "<div class='horLine'></div>";
	},

//	table: function() {
//		var trs = "";
//		this.parse_items(this.content, function(item, is_special){
//		  trs += "<tr><td>"+ item +"</td></tr>";
//		});
//		return "<table><tbody>"+ trs +"</tbody></table>";
//	},

	global_container: function(){
		return "<div class='global_container'>"+ this.content +"</div>";
	},

	main_navigation: function(){
		return "<ul class='nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
	},

	user_navigation: function(){
		return "<ul class='user_nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
	},

//	footer_navigation: function(){
//		return "<ul class='footer_nav'><li>Nav item 1</li><li>Nav item 2</li><li>Nav item 3</li></ul>";
//	},

	parse_items: function( list, callback) {
		list.split("\n").forEach( function(item){
			var is_special = false;
			if(item[0] == "*"){
				is_special = true;
				item = item.substring(1);
			}
			callback(item, is_special);
		});
	}
};

