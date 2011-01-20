var sys = module.parent.exports.sys
  , fs  = module.parent.exports.fs;

var MessageProcessor = {
	process: function (client, message) {
		for(action in message){
			if(this[action]){ this[action](client,message[action]); }
			else						{ console.log("Undefined action: " + action); }
		}
	},
	update_name: function(client, data) {
    if (typeof data.new_name != 'string') return false;

    var new_name = data.new_name.trim();
    if (new_name != '') {
      client.send({
        announcement: 'You successfully changed your display name to ' + new_name + '.',
        update_name: { new_name: new_name }
      });
      client.broadcast({  announcement:  client.user.handle() + ' changed their display name to ' + new_name + '.'} );
      client.user.name = new_name;
      return true;
    } else {
      return false;
    }
	},
	message: function(client,data){	
		var msg = {  message: client.user.handle() + data };
		client.broadcast(msg); // TODO change to associate to projects
		client.send(msg);
	}
};

exports.MessageProcessor = MessageProcessor;

