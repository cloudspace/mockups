
function MessageProcessor(socket) {
  var that = this;

  this.socket = socket;
  this.socket.connect();
  this.socket.on('message', function(obj) {
    if ('connected' in obj) {
      $('#flash').html('');
    } else {
      // It's likely that messages will have different attributes,
      // distinguishing between announcements, growl-like messages, and other stuff.
      // TODO clean up
      if (obj.announcement) {
        $('#flash').append('<p><strong>' + obj.announcement + '</strong></p>');
      }
      if (obj.message) {
        $('#flash').append('<p>' + obj.message + '</p>');
      }

      if (obj.action) {
        that[obj.action](obj[obj.action]);
      }
      $('#flash').scrollTop(1000000);
    }
  });
}


MessageProcessor.prototype.update_name = function(data) {
  display_name = data.new_name;
  reset_display_name();
};


