var sys			 = module.parent.exports.sys
  , fs			 = module.parent.exports.fs
  , projects = module.parent.exports.projects;

var Project = function (id) {
	this.id = id;
	this.clients = {};
};

exports.Project = Project;

