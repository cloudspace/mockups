
$(window).load(function() {

	// Key bindings used so that users may delete mockup objects (with the delete key).
	$(document).keydown(function(e) {
		if ($(document.activeElement).is('input, textarea') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;
		switch (e.keyCode) {
			case 8:  // backspace key
			case 46: // delete key
				$('#canvas .ui-selected').each(function() {
					env.socket.send({
					  canvas_object_delete: {
							canvas_object: { id: $(this).attr('canvas_object_id') },
							page:          { id: env.project.current_page }
						}
					});
				});
				break;
			default:
				return;
		}
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return false;
	});

});


$(document).ready(function(){
	env = new Environment();
	env.connect();

	$('#sideBar .elements li').draggable({
		appendTo: $("#canvas"),
	  helper: function() {
			var id = $(this).attr('template_id');
			var $el = $('<div></div>')
				.addClass('canvas_object')
				.html(Renderer.render_helper(id));
			return $el;
		}
	});

	$('form.canvas_object_update').live('submit',function(e){
			var message = {}, 
			    canvas_object = env.project.canvas_object($(this).attr('canvas_object_id'));
			message['canvas_object_update'] = {
				canvas_object: {
					template_id: canvas_object.template_id,
					top:         canvas_object.top,
					left:        canvas_object.left,
					id:          canvas_object.id,
					content:     $(this).find('textarea').val()
				},
				page:        { id: env.project.current_page }
			};
			env.socket.send(message);
			$('.option_pane').remove();
			return false;	
	});
	
	$('.canvas_object').live('dblclick',function(e){ 
		$('.option_pane').remove();
		var $tgt = $(e.target), canvas_object_id = $(this).attr('canvas_object_id');
		var content = get_canvas_object_content(canvas_object_id);
		if(!is_editable(canvas_object_id)){ return false; }

		$("<div><form canvas_object_id='"+ canvas_object_id +"' class='canvas_object_update'><textarea>"+ content +"</textarea><input type='submit' value='submit'/></form></div>")
			.addClass("canvas_object_edit").dialog({ 
			closeOnEscape: true,
			dialogClass:   'option_pane',
		});
		$("#canvas").one('click',function(e){
			$('.option_pane').remove();
			e.stopPropagation();
		});
	});

	is_editable = function(canvas_object_id){
		var canvas_object = env.project.canvas_object(canvas_object_id);
		return templates[canvas_object.template_id].editable_content;
	}
	get_canvas_object_content = function(canvas_object_id){
		var canvas_object = env.project.canvas_object(canvas_object_id);
		return canvas_object.content ? canvas_object.content : templates[canvas_object.template_id].default_content;
	}

	$('#canvas').droppable({
		drop: function(event, ui) {
			var $dragged_item    = $(ui.draggable), 
					template_id      = $dragged_item.attr('template_id'),
					canvas_object_id = $dragged_item.attr('canvas_object_id'), 
					message          = {}; //,ui.position;
			// if length > 0 then the dragged item is from the sidebar so it is a new canvas_object
			var message_type = $dragged_item.parent('.elements').length > 0 ? 'canvas_object_create' : 'canvas_object_update';
			message[message_type] = {
				canvas_object: {
					template_id: template_id,
					top:         ui.position.top,
					left:        ui.position.left,
					//top:         $dragged_item.css('top'),
					//left:        $dragged_item.css('left'),
					id:          canvas_object_id,
					content:     env.project.canvas_object(canvas_object_id)? env.project.canvas_object(canvas_object_id).content: undefined
				},
				page:        { id: env.project.current_page }
			};
			env.socket.send(message);
		},
		accept: '.elements li, .canvas_object'
	});

	$('#canvas').selectable({
		cancel: '.clear',
		filter: '.canvas_object', // We don't actually want children to be draggable or selectable.
		delay: 10
	});

	$(window).click(function(e) {
		env.socket.send({message: "x: " + e.pageX + ", y: " + e.pageY});
	});

	// Handle user changing their display name.
	// TODO move to User
	$('#name_change').submit(function(){
		env.socket.send({ user_update: { name: $('#display_name').val() } });
		$('#display_name').blur();
		return false;
	});

	// Resets input field to current display_name.
	// The only way this should get
	// TODO move to User
	$('#display_name').blur(function(){
		reset_display_name();
	});

	$('#mockup_pages .delete').live('click', function() {
		if ($('#mockup_pages .delete').length == 1) {
			alert("You can't delete the last page on a project.");
		} else {
			env.socket.send({ page_delete: { page_id: $(this).attr('page_id') } });
		}
	});

	$('#add_page').live('click', function() {
		env.socket.send({ page_create: true });
	});

	$('#mockup_pages a.selected').live('click', function(e) {
		env.project.open_input_box($(e.target));
		return false;
	});


	$('#mockup_pages .name_update input').live('blur', function(e) {
		var $tgt = $(e.target),page_id = $tgt.parent().attr('page_id');
		$tgt.addClass('h')
			.siblings('a').removeClass('h');
		
		$tgt.val(env.project.pages[page_id].name);
	});

	$('#mockup_pages li form.name_update').live('submit', function(){
		var $page_name_input = $(this).find('input');
		var page_id = $(this).attr('page_id');
		if($page_name_input.val() == "") return false;
		env.socket.send({
			page_update: {
				id: env.project.id,
				hash: env.project.hash,
				page: {
					id: page_id,
					name: $page_name_input.val()
				}
			}
		});
		$page_name_input.val(env.project.pages[page_id].name);
		return false;
	});
});

// TODO move to User
function reset_display_name() {
	$('#display_name').val(env.display_name);
}

function load_hash(hash) {
	if (hash) {
		hash = hash.split('/');
		if (typeof env.project == 'undefined') {
			env.socket.send({ project_find: { id: hash[0], hash: hash[1] } });
		} else if (env.project.id != hash[0]) {
			env.project = undefined;
			env.socket.send({ project_find: { id: hash[0], hash: hash[1] } });
		} else {
			env.project.select_page(hash[2]);
		}
	} else {
		env.project = undefined;
		env.socket.send({ project_create: {} });
	}
}



