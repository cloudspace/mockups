
/*

var Page = function (doc, project_doc) {
		this.id             = doc.id
		this.project        = project_doc;
		this.name           = doc.name;
		this.canvas_objects = doc.canvas_objects;
};

Page.prototype.json = function() {
	// delete this.project;
	return {
		id: this.id,
		name: this.name,
		canvas_objects: this.canvas_objects
	};
};

Page.create = function(project, callback) {
			var update = {}, index = 'pages.'+ project.pages_created;
			update[index] = { name: 'New Page', canvas_objects: {} };
			collection.update( { _id: project._id },
				{ $set: update, $inc: { pages_created: 1 } }, {},
			function(err, doc) {
				update[index].id = project.pages_created;
				callback(new Page(update[index], project));
			});
};

// Returns the path to the current page in mongo
//
// e.g. returns "pages.12" for a page with id = 12
Page.prototype.mongo_path = function() { return "pages."+ this.id; };

Page.prototype.delete = function(callback) {
				for (var i in doc.pages){
					page_count += 1;
					if (page_count > 1) break;
				}

				if (page_count == 1) {
					that.error = 'last_page';
			  	callback(that);
			  	return;
				}
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
*/
