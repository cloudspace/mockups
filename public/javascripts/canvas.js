

$(document).ready(function () {

	$('form.canvas_object_update').live('submit', function (e) {
			var canvas_object = env.project.canvas_object($(this).attr('canvas_object_id'));
			env.socket.send({
				canvas_object_update: {
					page            : { _id: env.project.current_page._id }
					, canvas_object : {
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
					page            : { _id: env.project.current_page._id }
					, canvas_object : { _id: $(this).parents('form').attr('canvas_object_id') },
				}
			});
		});
		return false;
	});
	
	$('.canvas_object').live('dblclick', function (e) {
		var $tgt = $(e.target), canvas_object_id = $(this).attr('canvas_object_id');
		$('.canvas_object_edit').remove();

		var $option_pane = $('<div class="canvas_object_edit"></div>').dialog({ 
			closeOnEscape : true
			, dialogClass : 'option_pane'
			, resizable   : false
			, title       : 'Edit Element'
		}).html(Views.canvas_object_edit(canvas_object_id));

		$(".canvas_object_update textarea").select();

		$("#canvas").one('click', function (e) {
			$('.canvas_object_edit').remove();
			//$('.option_pane').remove();
			e.stopPropagation();
		});
	});

	$('#canvas').droppable({
		accept : '.elements li, .canvas_object'
		, drop : function (event, ui) {
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
				canvas_object : {
					template_id : template_id
					, top       : ui.position.top
					, left      : ui.position.left
					, _id       : canvas_object_id
				}
				, page        : { _id: env.project.current_page._id }
			};
			env.socket.send(message);
		}
	});

	$('#canvas').selectable({
		cancel   : '.clear'
		, filter : '.canvas_object'
		, delay  : 10
	});

});

