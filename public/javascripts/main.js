$(document).ready(function(){
	env = new Environment();
	env.connect();


	// This is purely for sending messages in the app's early stages.
	// We don't really want to send messages for mouse clicks.
	$(window).click(function(e){
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
});

// TODO move to User
function reset_display_name() {
	$('#display_name').val(env.display_name);
}

function load_hash(hash) {
	if (hash) {
		hash = hash.split('/');
		if (env.project.id != hash[0]) {
			env.project.load(hash[0]);
		}
	} else {
		env.project = new Project();
		env.project.create();
		// so explicitly initialize the new Project in addition to resetting.
	}
}



