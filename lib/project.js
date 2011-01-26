var sys = module.parent.exports.sys
  , fs  = module.parent.exports.fs;

var Project = function (id) {
	if (!id) {
		// create in database
		this._id = 'new';
	} else {
		// look up in database by id
		this._id = id;
	}
};

Project.find = function(hash) {
	// find hash in mongo, return result
	return new Project(hash);
};

exports.Project = Project;

