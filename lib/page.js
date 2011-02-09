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

// Deletes a page from a project's pages object
//
// Params:
//   callback :: a callback function, which is passed the page that was deleted
Page.prototype.delete = function(callback) {
	var delete_statement = '{ "pages.' + this.id + '": 1 }', that = this, page_count=0;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: that.project_id }, function(err,doc){
				for (var i in doc.pages){
					page_count += 1;
					if(page_count > 1) break;
				}
				if (page_count == 1) {
					that.error = 'last_page';
			  	callback(that);
			  	return;
				}
				collection.update( { _id: that.project_id },
					{ $unset: JSON.parse(delete_statement) }, {},
					function(err,doc){
						if(err != null){ that.error = err; }
						callback(that);
				});
			});
		});
	});
};

Page.find_by_id_and_project_id = function(page_id, project_id, callback){
	var that=this;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: project_id }, function(err, doc) {
				if(typeof doc == "undefined" || typeof doc.pages[page_id] == "undefined"){
					callback(new Page());
					return;
				}
				var page_data = doc.pages[page_id];
				page_data.project_id = project_id;
				page_data.id = page_id;
				callback(new Page(page_data));
			});
		});
	});

};

exports.Page = Page;
