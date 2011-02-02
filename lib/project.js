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
					pages_created: 1,
					pages: { '0' : { name: 'home', mockup_objects: { } } }
				}, function(err, docs) {
				callback(docs[0]);
			});

		});
	});
};

// Accepts "data" object that should have an id and hash:
// data = { id: 'idstring', hash: 'hashstring' }
// Returns params (err, project) to callback
// TODO make these errors more descriptive
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

Project.add_page = function(id, callback) {
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: id }, function(err, doc) {
				var update = {};
				update['pages.' + doc.pages_created] = { name: 'New Page', mockup_objects: {} };
				collection.update( { _id: id },
					{ $set: update, $inc: { pages_created: 1 } }, {},
				function(err, doc) {
					var error = (typeof doc == 'undefined' ? '' : undefined);
					callback(error, update);
				});
			});
		});
	});
};

Project.delete_page = function(id, page_id, callback) {
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: id }, function(err, doc) {

				// Prevent deletion of last page.
				var page_count = 0;
				for (var i in doc.pages) page_count += 1;
				if (page_count == 1) {
					callback('', undefined);
					return;
				}

				var update = {};
				update['pages.' + page_id] = 1;
				collection.update( { _id: id },
					{ $unset: update }, {},
				function(err, doc) {
					var error = (typeof doc == 'undefined' ? '' : undefined);
					callback(error, update);
				});
			});
		});
	});
};

Project.update = function(data, callback) {
	var that = this;
	Project.find(data, function(err, project){
		if(err != undefined){callback('',undefined);return;}//error project not found
		updated_project = that.update_values(project, data);
		db.collection('projects', function(err, collection) {
			collection.update(
				{ _id: project._id, hash: project.hash},
				project,
				function(err, doc){
					var error = (typeof doc == 'undefined' ? '' : undefined);
					callback(error,doc);
			});
		});
	});
};

Project.update_values = function(original, changes){
  for (var p in changes) {
    try {
      if ( changes[p].constructor==Object ) {
        original[p] = this.update_values(original[p], changes[p]);
      } else {
        original[p] = changes[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      original[p] = changes[p];
    }
  }
  return original;
};

exports.Project = Project;

