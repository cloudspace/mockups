
function get_canvas_object_content (canvas_object_id) {
	var canvas_object = env.project.canvas_object(canvas_object_id);
	return canvas_object.content ? canvas_object.content : templates[canvas_object.template_id].default_content;
};

function show_connected_screen (override) {
	$('#connecting').dialog('destroy');
	$('.ui-dialog').remove();
	if (!$.cookie('skipconnect') || override) {
		$(Views.overlay()).appendTo('body');
		$("#canvas .canvas_object, #floatingpanel, #growl").hide();
	}
}

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

	// TODO poor naming conventions here. make this work.
	$('.overlay').live('click', function () {
		$('.overlay').remove();
		$('#canvas .canvas_object, #floatingpanel, #growl').show();
		$.cookie('skipconnect', true); 
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



