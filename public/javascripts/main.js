
$(window).load(function() {

	// Key bindings used so that users may delete mockup objects (with the delete key).
	$(document).keydown(function(e) {
		last_key_pressed = e.keyCode || "";
		if ($(document.activeElement).is('input, textarea') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;
		//Key bindings from: http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
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

});

$(document).ready(function(){
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

$(document).ready(function(){

  $('#settings').hide();
	$('#tabs h3').click(function(){
		var id = $(this).html().toLowerCase();
		$('div#' + id).show().siblings('div').hide();
		$(this).removeClass('inactive').siblings('h3').addClass('inactive');
	});

	$('#tools .elements li').draggable({
		appendTo: $("#canvas"),
		cursorAt: { left: 0, top: 0 },
		helper: function() {
			var id = $(this).attr('template_id');
			var $el = $('<div></div>')
				.addClass('canvas_object')
				.html(Renderer.render_helper(id));
			return $el;
		}
	});

	$("#expandcollapse").click(function(){
		  $("#tabs").slideToggle(300);
			  $(this).toggleClass('collapsed');
	});
	
	$(".section_break").click(function(){
		$(this).toggleClass('collapsed').next().slideToggle(300);
	});

	$('form.canvas_object_update').live('submit',function(e){
			var canvas_object = env.project.canvas_object($(this).attr('canvas_object_id'));
			env.socket.send({
				canvas_object_update: {
					canvas_object: {
						template_id: canvas_object.template_id,
						id:          canvas_object.id,
						content:     $(this).find('textarea').val(),
						width:       $(this).find('input[name=width]').val(),
						height:      $(this).find('input[name=height]').val(),
						fontsize:    $(this).find('input[name=fontsize]').val()
					},
					page:        { id: env.project.current_page }
				}
			});
			$('.option_pane').remove();
			$('.canvas_object_edit').remove();
			return false;	
	});

	$('.canvas_object_edit .delete').live('click', function(e) {
		$('.canvas_object_edit').remove();
		$(this).each(function() {
			env.socket.send({
				canvas_object_delete: {
					canvas_object: { id: $(this).parents('form').attr('canvas_object_id') },
					page:          { id: env.project.current_page }
				}
			});
		});
		return false;
	});
	
	$('.canvas_object').live('dblclick', function(e) {
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

		$("#canvas").one('click', function(e) {
			$('.option_pane').remove();
			$('.canvas_object_edit').remove();
			e.stopPropagation();
		});
	});

	get_canvas_object_content = function(canvas_object_id){
		var canvas_object = env.project.canvas_object(canvas_object_id);
		return canvas_object.content ? canvas_object.content : templates[canvas_object.template_id].default_content;
	};

	show_connected_screen = function(){
		$('#connecting').dialog('destroy');
		$('.ui-dialog').remove();
		if (!$.cookie('skipconnect')) {
			$(Views.overlay()).appendTo('body');
			$("#canvas .canvas_object, #floatingpanel, #growl").hide();
/*
	$connected = $(Views.connected());
			$connected
				.dialog({
						minHeight: 50,
						resizable: false,
						closeOnEscape: true,
						title: 'Connected',
						modal: true,
						zIndex: 10001
				}).find('form').submit(function() {
					var checked = $(this).find('input[type=checkbox]').attr('checked');
					if (checked) $.cookie('skipconnect', true);
					$('#connected').dialog('destroy');
					$('.ui-dialog').remove();
					return false;
				});
*/
		}
	};

	$('.overlay').live('click',function(){
		$(".overlay").remove();
		$("#canvas .canvas_object, #floatingpanel, #growl").show();
	});
	
	$('#help').live('click', function(e){
		show_connected_screen();
	});
	
	$('#floatingpanel').draggable({
		handle: '#handler',
		containment: 'html',
	});

	$('#canvas').droppable({
		drop: function(event, ui) {
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
				canvas_object: {
					template_id: template_id,
					top:         ui.position.top,
					left:        ui.position.left,
					id:          canvas_object_id,
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
		// #canvas has a lot of click-capturing (draggable, droppable, selectable, resizable)
		// so we force all input boxes to blur when it is clicked since those jquery plugins
		// hijack the clicks and prevent the default behavior from occurring
		$target = $(e.target);
		if ($target.is('#canvas') || $target.parents('#canvas').length == 1) {
			$('input').blur();
			$('#canvas .ui-selected').removeClass('ui-selected');
		}
	});

	// Handle user changing their display name.
	$('#name_change').submit(function(){
		env.socket.send({ user_update: { name: $('#display_name').val() } });
		$('#display_name').blur();
		return false;
	});

	// Resets input field to current display_name.
	// The only way this should get
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
		var $tgt = $(e.target), page_id = $tgt.parent().attr('page_id');
		$tgt.addClass('h').siblings('a').removeClass('h');
		$tgt.val(env.project.pages[page_id].name);
	});



	$('#mockup_pages li form.name_update').live('submit', function(){
		var $page_name_input = $(this).find('input'), page_id = $(this).attr('page_id');
		if ($page_name_input.val() == "") return false;
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
			env.socket.send({ project_find: { id: hash[1], hash: hash[2] } });
		} else if (env.project.id != hash[1]) {
			env.project = undefined;
			env.socket.send({ project_find: { id: hash[1], hash: hash[2] } });
		} else {
			env.project.select_page(hash[3]);
		}
	} else {
		env.project = undefined;
		env.socket.send({ project_create: {} });
	}
}



