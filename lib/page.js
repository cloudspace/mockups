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
		this.id							= doc.id
		this.project_id 		= doc.project_id;
		this.mockup_objects = doc.mockup_objects;
		this.name						= doc.name;
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
			var update = {}, index = 'pages.'+ project.pages_created;
			update[index] = { name: 'New Page', mockup_objects: {} };
			collection.update( { _id: project._id },
				{ $set: update, $inc: { pages_created: 1 } }, {},
			function(err, doc) {
				update[index].project_id = project._id;
				update[index].id         = project.pages_created;
				callback(new Page(update[index]));
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

*/

exports.Page = Page;
