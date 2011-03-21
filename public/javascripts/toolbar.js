
$(document).ready(function () {

  $('#settings').hide();

	$('#tabs h3').click(function () {
		var id = $(this).html().toLowerCase();
		$('div#' + id).show().siblings('div').hide();
		$(this).removeClass('inactive').siblings('h3').addClass('inactive');
	});

	$('#tools .elements li').draggable({
		appendTo: $("#canvas"),
		cursorAt: { left: 0, top: 0 },
		helper: function () {
			var id = $(this).attr('template_id');
			var $el = $('<div></div>')
				.addClass('canvas_object')
				.html(Renderer.render_helper(id));
			return $el;
		}
	});

	$("#expandcollapse").click(function () {
		$("#tabs").slideToggle(300);
		$(this).toggleClass('collapsed');
	});
	
	$(".section_break").click(function () {
		$(this).toggleClass('collapsed').next().slideToggle(300);
	});

	$('#name_change').submit(function () {
		env.socket.send({ user_update: { name: $('#display_name').val() } });
		$('#display_name').blur();
		return false;
	});

	$('#project_name_change').submit(function () {
		var project_name_input = $(this).find('input');
    env.socket.send({ project_update: { name: project_name_input.val() } });
		project_name_input.val(env.project.name);
    project_name_input.blur();
		return false;
	});

	$('#display_name').blur(function () {
		reset_display_name();
	});
	
	$('#add_page').live('click', function () {
		env.socket.send({ page_create: true });
	});

	$('#mockup_pages a.selected').live('click', function (e) {
		env.project.open_input_box($(e.target));
		return false;
	});

	$('#mockup_pages .name_update input').live('blur', function (e) {
		var $tgt = $(e.target), page_id = $tgt.parent().attr('page_id');
		$tgt.addClass('h').siblings('a').removeClass('h');
		$tgt.val(env.project.find_page_by_id(page_id).name);
	});

	$('#mockup_pages li form.name_update').live('submit', function () {
		var $page_name_input = $(this).find('input'), page = env.project.pages[$(this).attr('page_id')];
		if ($page_name_input.val() == "") return false;
		env.socket.send({
			page_update: {
				page: {
					_id: page._id,
					name: $page_name_input.val()
				}
			}
		});
		$page_name_input.val(page.name);
		return false;
	});

	$('#mockup_pages li .delete').live('click', function () {
		if ($('#mockup_pages li .delete').length == 1) {
			alert("You can't delete the last page on a project.");
		} else {
			env.socket.send({ page_delete: { page: { _id: $(this).attr('page_id') } } });
		}
	});

	$('#help').live('click', function (e) {
		show_connected_screen();
	});
	
	$('#floatingpanel').draggable({
		handle: '#handler',
		containment: 'html',
	});

});

function reset_display_name() {
	$('#display_name').val(env.display_name);
}

