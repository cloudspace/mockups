
$(window).load(function() {

  $(document).keydown(function(e) {
		if ($(document.activeElement).is('input') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;
		switch (e.keyCode) {
			case 8: // delete key
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
			return $(env.templates[id].render).addClass('canvas_object');
		}
	});

	$('#canvas').droppable({
		drop: function(event, ui) {
			var $dragged_item = $(ui.draggable), template_id = $dragged_item.attr('template_id'), message = {};//,ui.position;
			// if length > 0 then the dragged item is from the sidebar so it is a new canvas_object
			var message_type = $dragged_item.parent('.elements').length > 0 ? 'canvas_object_create' : 'canvas_object_update';
			message[message_type] = {
				canvas_object: {
					template_id: template_id,
					top:         ui.position.top,
					left:        ui.position.left,
					id:          $dragged_item.attr('canvas_object_id')
				},
				page:        { id: env.project.current_page }
			};
			env.socket.send(message);
		}
	});

	$('#canvas').selectable({
		cancel: '.clear',
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
			env.socket.send({ page_delete: { page_id: $(this).attr('data-id') } });
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
		$tgt = $(e.target);
		$tgt.addClass('h')
			.siblings('a').removeClass('h');
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



