var db      = module.parent.exports.db
  , Project = require('./project').Project;


// Instantiates a CanvasObject object based upon a JSON object.
//
// Params:
//   doc :: a JSON object from a MongoDB update
//   page_doc :: a JSON object from MongoDB representing a page
var CanvasObject = function (doc, page_doc) {
	// The canvas object could not be found.
	if (!doc) {
		this.error = '404';
		return;
	}
		this.id             = doc.id
		this.page           = page_doc;
		this.top            = doc.top;
		this.left           = doc.left;
		this.template_id    = doc.template_id;
};

// Used to return the prepared data to the client.
// Notably, does not return the page object.
CanvasObject.prototype.json = function() {
	// delete this.page;
	return {
		id: this.id,
		top: this.top,
		left: this.left,
		template_id: this.template_id,
		page: {
			id: this.page.id
		}
	};
};

// Writes a new canvas_object and returns a CanvasObject object based upon the MongoDB update
//
// Params:
//   page :: the page in which we're creating a canvas object
//   callback :: a callback function, which is passed a canvas_object or page (if it had errors when loading)
CanvasObject.create = function(page, data, callback) {
	if (page.error) {
		callback(page);
		return;
	}

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			var update = {}, id = page.project.canvas_objects_created, index = 'pages.' + page.id + '.canvas_objects.' + id;
			update[index] = { top: data.top, left: data.left, template_id: data.template_id, id: id };
			collection.update( { _id: page.project._id },
				{ $set: update, $inc: { canvas_objects_created: 1 } }, {},
			function(err, doc) {
				callback(new CanvasObject(update[index], page));
			});
		});
	});
};

exports.CanvasObject = CanvasObject;
