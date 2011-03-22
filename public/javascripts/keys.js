
$(window).load(function () {
	$(document).keydown(function (e) {
		last_key_pressed = e.keyCode || "";
		if ($(document.activeElement).is('input, textarea') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return true;

		// Key bindings from:
		// http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
		switch (e.keyCode) {
			case 8:  // backspace key
			case 46: // delete key

				// TODO make this send an array of canvas objects rather than multiple send() calls
				$('#canvas .ui-selected').each(function () {
					env.socket.send({
					  canvas_object_delete: {
							canvas_object : { _id: $(this).attr('canvas_object_id') }
							, page        : { _id: env.project.current_page._id }
						}
					});
				});
				break;

			// c implement copy mockup object (we'll have to alter how alt/ctrl/shift key is treated)
			case 67:
				break;
			// v implement paste mockup object
			case 86:
				break; 
			default:
				return;
		}

		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		return false;
	});

});

