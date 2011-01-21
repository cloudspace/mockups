

$(document).ready(function(){
	socket = new io.Socket(null, {port: 8080, rememberTransport: false});

	// Seed certain global variables.
	// TODO move to User
	display_name = 'Anonymous';
	project = new Project();

	socket.connect();
	socket.on('message', function(obj) { MessageProcessor.process(obj); });

	$.history.init(load_hash);

	// This is purely for sending messages in the app's early stages.
	// We don't really want to send messages for mouse clicks.
	$(window).click(function(e){
		socket.send({message: "x: " + e.pageX + ", y: " + e.pageY});
	});

	// Handle user changing their display name.
	// TODO move to User
	$('#name_change').submit(function(){
		socket.send({ update_name: { new_name: $('#display_name').val() } });
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
	$('#display_name').val(display_name);
}

function load_hash(hash) {
	if (hash) {
		hash = hash.split('/');
		if (project.id != hash[0]) {
			project.load(hash[0]);
		}
	} else {
		project = new Project();
		// Create a new Project;
		// so explicitly initialize the new Project in addition to resetting.
	}
}



