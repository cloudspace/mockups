var db      = module.parent.exports.db
  , Project = require('./project').Project;


// Instantiates a Page object based upon a JSON object.
//
// Params:
//   doc :: a JSON object from a MongoDB update
var Page = function (doc) {
	// The page could not be found.
  if (!doc) {
    this.error = '404';
    return;
  }

	var page_id;
	for (var key in doc) {
		var page = key.split('.');
		page_id = page[1];
		this[page_id] = doc[key];
	}
};

// Writes a new page and returns a Page object based upon the MongoDB update
//
// Params:
//   project :: the project in which we're creating a page
//   callback :: a callback function, which is passed a page or a project (if it had errors when loading)
Page.create = function(project, callback) {
	if (project.error) {
		callback(project);
		return;
	}

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			var update = {};
			update['pages.' + project.pages_created] = { name: 'New Page', mockup_objects: {} };
			collection.update( { _id: project._id },
				{ $set: update, $inc: { pages_created: 1 } }, {},
			function(err, doc) {
				callback(new Page(update));
			});
		});
	});
};

/*


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

*/

exports.Page = Page;
