var sys			 = module.parent.exports.sys
  , fs			 = module.parent.exports.fs
  , channels = module.parent.exports.channels;

var Channel = function (id) {
	this.id = id;
	this.clients = {};
};

exports.Channel = Channel;

