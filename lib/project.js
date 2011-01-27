var db  = module.parent.exports.db
  , crypto = require('crypto');

var Project = function (callback) {
	var that = this;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.insert({ pages: [{ name: 'Home', mockup_objects: { } }] }, function(err, docs) {
				Project.save_hash(docs[0]._id);
				callback(docs[0]);
			});
		});
	});
};

Project.find = function(hash) {
	// find hash in mongo, return result
	return new Project(hash);
};

Project.save_hash = function (id) {
	var hash = crypto.createHash('sha1').update(id).digest('hex');

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ hash: hash }, function(err, docs) {
				if (typeof docs == 'undefined') {
					collection.update({ _id: id }, { $set: { hash: hash } });
					db.close();
					return hash;
				} else {
					// add padding because there has been a birthday collision
					return Project.save_hash(id + '.');
				}
			});
		});
	});
}

exports.Project = Project;

