
$(window).load(function () {

/*
	// Key bindings used so that users may delete mockup objects (with the delete key).
	$(document).keydown(function (e) {
		last_key_pressed = e.keyCode || "";
		if ($(document.activeElement).is('input, textarea') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;
		//Key bindings from: http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
		switch (e.keyCode) {
			case 8:  // backspace key
			case 46: // delete key
				$('#canvas .ui-selected').each(function () {
					env.socket.send({
					  canvas_object_delete: {
							canvas_object: { id: $(this).attr('canvas_object_id') },
							page:          { id: env.project.current_page }
						}
					});
				});
				break;

			//look at last_key_pressed
			case 67://c implement copy mockup object
			break;
			case 86://v implement paste mockup object
			break; 
			default:
				return;
		}
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return false;
	});
*/

});

$(document).ready(function () {
	$connecting = $(Views.connecting());
	$connecting
		.dialog({
			resizable: false,
			modal: true,
			zIndex: 10001,
			title: 'Connecting',
			closeOnEscape: false,
		});

	env = new Environment();
	env.connect();
});

$(document).ready(function () {

	$('form.canvas_object_update').live('submit', function (e) {
			var canvas_object = env.project.canvas_object($(this).attr('canvas_object_id'));
			env.socket.send({
				canvas_object_update: {
					page          : { _id: env.project.current_page._id },
					canvas_object : {
						template_id : canvas_object.template_id
						, _id       : canvas_object._id
						, content   : $(this).find('textarea').val()
						, width     : $(this).find('input[name=width]').val()
						, height    : $(this).find('input[name=height]').val()
						, fontsize  : $(this).find('input[name=fontsize]').val()
					},
				}
			});
			$('.option_pane').remove();
			$('.canvas_object_edit').remove();
			return false;	
	});

	$('.canvas_object_edit .delete').live('click', function (e) {
		$('.canvas_object_edit').remove();
		$(this).each(function () {
			env.socket.send({
				canvas_object_delete: {
					page:          { _id: env.project.current_page._id },
					canvas_object: { _id: $(this).parents('form').attr('canvas_object_id') },
				}
			});
		});
		return false;
	});
	
	$('.canvas_object').live('dblclick', function (e) {
		$('.canvas_object_edit').remove();
		var $tgt = $(e.target), canvas_object_id = $(this).attr('canvas_object_id');

		var $option_pane = $("<div></div>")
			.addClass("canvas_object_edit").dialog({ 
			closeOnEscape: true,
			dialogClass:   'option_pane',
			resizable:     false,
			title:         'Edit Element'
		}).html(Views.canvas_object_edit(canvas_object_id));

		$(".canvas_object_update textarea").select();

		$("#canvas").one('click', function (e) {
			$('.option_pane').remove();
			$('.canvas_object_edit').remove();
			e.stopPropagation();
		});
	});

	get_canvas_object_content = function (canvas_object_id) {
		var canvas_object = env.project.canvas_object(canvas_object_id);
		return canvas_object.content ? canvas_object.content : templates[canvas_object.template_id].default_content;
	};

	show_connected_screen = function (override) {
		$('#connecting').dialog('destroy');
		$('.ui-dialog').remove();
		if (!$.cookie('skipconnect') || override){
			$(Views.overlay()).appendTo('body');
			$("#canvas .canvas_object, #floatingpanel, #growl").hide();
		}
	};

	$('.overlay').live('click',function () {
		$(".overlay").remove();
		$("#canvas .canvas_object, #floatingpanel, #growl").show();
		$.cookie('skipconnect', true); 
	});
	
	$('#canvas').droppable({
		drop: function (event, ui) {
			$('input').blur();

			var $dragged_item    = $(ui.draggable), 
					template_id      = $dragged_item.attr('template_id'),
					canvas_object_id = $dragged_item.attr('canvas_object_id'), 
					canvas_object    = env.project.canvas_object(canvas_object_id),
					message          = {}; //,ui.position;

			// returns if the canvas_object's position is unchanged
			if (canvas_object) {
				if (ui.position.top == canvas_object.top && ui.position.left == canvas_object.left) return;
			}

			// if length > 0 then the dragged item is from the sidebar so it is a new canvas_object
			var message_type = $dragged_item.parent('.elements').length > 0 ? 'canvas_object_create' : 'canvas_object_update';
			message[message_type] = {
				page          : { _id: env.project.current_page._id },
				canvas_object : {
					template_id : template_id,
					top         : ui.position.top,
					left        : ui.position.left,
					_id         : canvas_object_id,
				},
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

	$(window).click(function (e) {
		// #canvas has a lot of click-capturing (draggable, droppable, selectable, resizable)
		// so we force all input boxes to blur when it is clicked since those jquery plugins
		// hijack the clicks and prevent the default behavior from occurring
		$target = $(e.target);
		if ($target.is('#canvas') || $target.parents('#canvas').length == 1) {
			$('input').blur();
			$('#canvas .ui-selected').removeClass('ui-selected');
		}
	});

});

function load_hash(hash) {
	if (hash) {
		hash = hash.split('/');
		if (typeof env.project == 'undefined') {
			env.socket.send({ project_find: { id: hash[1], hash: hash[2] } });
		} else if (env.project.id != hash[1]) {
			env.project = undefined;
			env.socket.send({ project_find: { id: hash[1], hash: hash[2] } });
		} else {
			env.project.select_page(env.project.find_page_by_id(hash[3]));
		}
	} else {
		env.project = undefined;
		env.socket.send({ project_create: {} });
	}
}



