
$(document).ready(function(){
  var socket = new io.Socket(null, {port: 8080, rememberTransport: false});
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

