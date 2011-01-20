

$(document).ready(function(){
  var socket = new io.Socket(null, {port: 8080, rememberTransport: false});

  // Seed certain global variables.
  display_name = '';


  socket.connect();
  socket.on('message', function(obj) { MessageProcessor.process(obj); });
  // This is purely for sending messages in the app's early stages.
  // We don't really want to send messages for mouse clicks.
  $(window).click(function(e){
    socket.send({message: "x: " + e.pageX + ", y: " + e.pageY});
  });

  // Handle user changing their display name.
  $('#name_change').submit(function(){
    socket.send({ update_name: { new_name: $('#display_name').val() } });
    $('#display_name').blur();
    return false;
  });

  // Resets input field to current display_name.
  // The only way this should get 
  $('#display_name').blur(function(){
    reset_display_name();
  });
});

function reset_display_name() {
  $('#display_name').val(display_name);
}

/*
// Currently unused escape method.
function esc(msg){
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
*/

