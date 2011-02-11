var db      = module.parent.exports.db
  , Project = require('./project').Project;


// Instantiates a Page object based upon a JSON object.
// Also sets page.project to the parent project object
//
// Params:
//   doc :: a JSON object from a MongoDB update
//   project_doc :: a JSON object from MongoDB representing a project
var Page = function (doc, project_doc) {
	// The page could not be found.
	if (!doc) {
		this.error = '404';
		return;
	}
		this.id             = doc.id
		this.project        = project_doc;
		this.name           = doc.name;
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
			update[index] = { name: 'New Page', canvas_objects: {} };
			collection.update( { _id: project._id },
				{ $set: update, $inc: { pages_created: 1 } }, {},
			function(err, doc) {
				update[index].id         = project.pages_created;
				callback(new Page(update[index], project));
			});

		});
	});
};

// Returns the path to the current page in mongo
//
// e.g. returns "pages.12" for a page with id = 12
Page.prototype.mongo_path = function() { return "pages."+ this.id; };

// Deletes a page from a project's pages object
//
// Params:
//   callback :: a callback function, which is passed the page that was deleted
Page.prototype.delete = function(callback) {
	var delete_statement = {}, that = this, page_count = 0;
	delete_statement[this.mongo_path()] = 1;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: that.project._id }, function(err, doc){
				for (var i in doc.pages){
					page_count += 1;
					if (page_count > 1) break;
				}

				if (page_count == 1) {
					that.error = 'last_page';
			  	callback(that);
			  	return;
				}

				collection.update( { _id: that.project._id },
					{ $unset: delete_statement }, {},
					function(err,doc){
						if(err != null){ that.error = err; }
						callback(that);
				});
			});
		});
	});
};

// Updates a page within a project
//
// Params:
//   data :: a JSON object
//           e.g. { name: 'New Project Name' }
//   callback :: a callback function, which is passed a project
Page.prototype.update = function(data, callback) {
	if (this.error) {
		callback(this);
		return;
	}
	var update = {}, that = this;
	if (data.name && data.name != ''){
		update[this.mongo_path() +'.name'] = data.name;
		this.name = data.name;
	}
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.update( { _id: that.project._id },
			{ $set: update }, { /* options */ }, function(err, statement) {
				callback(that)
			});
		});
	});
};

// Finds and returns a page by its id within a project
//
// Example:
// Given a project = { _id: 1, pages: { '0': page_0, '12': page_12 } }
//   find_by_id_and_project_id(12, 1, calback) returns page_12
//
// Params:
//   page_id :: id of the page
//   project_id :: id of the project
//   callback :: a callback function, which is passed a page object
Page.find_by_id_and_project_id = function(page_id, project_id, callback){
	var that = this;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: project_id }, function(err, doc) {
				if (typeof doc == "undefined" || typeof doc.pages[page_id] == "undefined"){
					callback(new Page());
					return;
				}
				var page_data = doc.pages[page_id];
				page_data.id = page_id;
				callback(new Page(page_data, new Project(doc)));
			});
		});
	});

};

exports.Page = Page;
