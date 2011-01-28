var db  = module.parent.exports.db
  , ObjectID = require('mongodb').ObjectID
  , crypto = require('crypto');

var Project = function (callback) {
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			// Create the project.
			var hash = crypto.createHash('md5').update(new Date()).digest('hex').substr(0,8);
			collection.insert(
				{ 
					name: 'New Project', 
					hash: hash,
					pages: {'0':{ name: 'home', mockup_objects: { } }} 
				}, function(err, docs) {
				callback(docs[0]);
			});

		});
	});
};

// Accepts "data" object that should have an id and hash:
// data = { id: 'idstring', hash: 'hashstring' }
// Returns params (err, project) to callback
Project.find = function(data, callback) {
	if (!data || !data.id || !data.hash) {
		callback('', undefined);
		return;
	}

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: new ObjectID(data.id), hash: data.hash }, function(err, doc) {
				// return error "''" if doc is not found
				// otherwise, leave error as undefined
				var error = (typeof doc == 'undefined' ? '' : undefined);
				callback(error, doc);
			});
		});
	});
};

exports.Project = Project;

