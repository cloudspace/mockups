var db  = module.parent.exports.db
  , ObjectID = require('mongodb').ObjectID
  , crypto = require('crypto');

// Instantiates a Project object based upon a JSON object.
//
// Params:
//   doc :: a JSON object / document from MongoDB 
//          e.g. { _id: ..., name: "A Project", hash: "abcdef12", pages: {...}, pages_created: 1 }
//
var Project = function (doc) {
  if (!doc) {
    // The project could not be found.
    this.error = '404';
    return;
  }

  this._id   = doc._id;
  this.name  = doc.name;
  this.hash  = doc.hash;
  this.pages = doc.pages;
  this.pages_created = doc.pages_created;
};

// Authorizes a client to edit a project, checking the input hash against this object's hash.
//
// Params:
//   hash :: a string
Project.prototype.authorize = function(hash) {
  if (hash == this.hash) {
    return true;
  } else {
    // The project could not be authorized with the given credentials.
    // TODO look into calling this a '401' error and any changes necessary on the front-end.
    this.error = '404'
    return false;
  }
};

// Creates a project in MongoDB and returns the document.
//
// Params:
//   callback :: a callback function, which is passed arguments (err, project)
Project.create = function(callback) {
  db.open(function(err, p_db) {
    db.collection('projects', function(err, collection) {
      collection.insert({
				name: 'New Project',
				// creates a hash from md5 of the current time
				hash: crypto.createHash('md5').update(new Date()).digest('hex').substr(0,8),
				pages_created: 1,
				pages: { '0': { name: 'home', mockup_objects: {} } }
			}, function(err, docs) {
        project = new Project(docs[0]);
        callback(err, project);
      });
    });
  });
};

// Finds a project in MongoDB by id.
//
// Params:
//   callback :: a callback function, which is passed arguments (err, project)
Project.find_by_id = function(id, callback) {
  if (!id || !callback) return undefined;

  db.open(function(err, p_db) {
    db.collection('projects', function(err, collection) {
      collection.findOne({ _id: new ObjectID(id) }, function(err, doc) {
        project = new Project(doc);
        callback(err, project);
      });
    });
  });
};


exports.Project = Project;

/*
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
*/

