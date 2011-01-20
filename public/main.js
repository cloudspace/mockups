
$(document).ready(function(){
  var socket = new io.Socket(null, {port: 8080, rememberTransport: false});

  // Seed certain global variables, although this can probably be abstracted into a User object.
  var display_name = 'Anonymous';

  socket.connect();
  socket.on('message', function(obj){
    if ('connected' in obj) {
      $('#flash').html('');
    } else {
      receive(obj);
    }
  });

  // This is purely for sending messages in the app's early stages.
  // We don't really want to send messages for mouse clicks.
  $(window).click(function(e){
    socket.send("x: " + e.pageX + ", y: " + e.pageY);
  });

  // Handle user changing their display name.
  // TODO Change this process so that the new name does not
  //      get set until a response is received from the node
  //      server. This requires planning for how to handle
  //      the message types (i.e. message processing) and
  //      syncing changes from the server to clients.
  $('#name_change').submit(function(){
    if ($('#display_name').blur().val().trim() == '') {
      // Reset the field to the old name (because submission was effectively blank).
      $('#display_name').val(display_name);
    } else {
      socket.send({ type: 'name_change', name_change: $('#display_name').val() });
    }
    return false;
  });
});

function receive(obj){
  // It's likely that messages will have different attributes,
  // distinguishing between announcements, growl-like messages, and other stuff.
  if (obj.announcement) {
    $('#flash').append('<p><strong>' + obj.announcement + '</strong></p>');
  } else if (obj.message) {
    $('#flash').append('<p>' + obj.message + '</p>');
  }
  $('#flash').scrollTop(1000000);
}

/*
// Currently unused escape method.
function esc(msg){
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
*/

