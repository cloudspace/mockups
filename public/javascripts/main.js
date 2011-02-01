$(document).ready(function(){
	env = new Environment();
	env.connect();


	$(window).click(function(e) { 
		env.socket.send({message: "x: " + e.pageX + ", y: " + e.pageY});
	});

	// Handle user changing their display name.
	// TODO move to User
	$('#name_change').submit(function(){
		env.socket.send({ update_name: { new_name: $('#display_name').val() } });
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
		env.socket.send({ delete_page: { page_id: $(this).attr('data-id') } });
	});

	$('#add_page').live('click', function() {
		env.socket.send({ add_page: true });
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
			env.socket.send({ find_project: { id: hash[0], hash: hash[1] } });
		} else if (env.project._id != hash[0]) {
			env.project = undefined;
			env.socket.send({ find_project: { id: hash[0], hash: hash[1] } });
		}
	} else {
		env.project = undefined;
		env.socket.send({ create_project: {} });
	}
}



