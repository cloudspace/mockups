var db      = module.parent.exports.db
  , Project = require('./project').Project;


// Instantiates a CanvasObject object based upon a JSON object.
//
// Params:
//   doc :: a JSON object from a MongoDB update
//   page :: an instantiated Page object
var CanvasObject = function (doc, page) {
	// The canvas object could not be found.
	if (!doc) {
		this.error = '404';
		return;
	}

	this.id             = doc.id
	this.page           = page;
	this.top            = doc.top;
	this.left           = doc.left;
	this.width          = doc.width;
	this.height         = doc.height;
	this.template_id    = doc.template_id;
	this.content        = doc.content;
	this.fontsize       = doc.fontsize;
};

// List of editable attributes within CanvasObject
CanvasObject.editable = [ 'top', 'left', 'content', 'width', 'height', 'fontsize' ];
// List of required formats 
CanvasObject.int_required = ['top', 'left', 'width', 'height', 'fontsize'];
CanvasObject.no_newlines  = ['list', 'check_box', 'radio_buttons'];

// Returns the path to the current canvas object in mongo
//
// e.g. returns "pages.12.canvas_objects.15" for a canvas object with id 15 on page 12
CanvasObject.prototype.mongo_path = function() { return 'pages.' + this.page.id + '.canvas_objects.' + this.id; };

// Returns the human readable version of the template_id
CanvasObject.prototype.name = function() { return this.template_id ? this.template_id.replace(/\_/g," ") : ''; };

// Used to return the prepared data to the client.
// Notably, does not return the page object.
// This is essentially the getters for the client-side
CanvasObject.prototype.json = function() {
	// delete this.page;
	return {
		id:          this.id,
		top:         this.top,
		left:        this.left,
		width:       this.width,
		height:      this.height,
		content:     this.content,
		fontsize:    this.fontsize,
		template_id: this.template_id,
		page: {
			id: this.page.id
		},
	};
};

//Enforces constraints on the data being inserted for the CanvasObject when it is created and updated
//
//Params: expects a message with a canvas_object/canvas_object data in it
//returns formated data as per the int_required/no_newlines arrays
CanvasObject.format_data = function(message) {
	var data = message['canvas_object'] ? message['canvas_object'] : message;

	for (var type in data) {
		if (CanvasObject.int_required.indexOf(type) != -1) {
			data[type] = isNaN(parseInt(data[type])) ? '' : parseInt(data[type]);
		}
		if (type == 'content' && typeof data.content == 'string') data.content = data.content = data.content.substring(0, 1024);
	}

	if (CanvasObject.no_newlines.indexOf(data['template_id']) != -1 && typeof data['content'] != 'undefined') {
		var lines = data.content.split("\n")
		, used_lines = new Array();
		for (var cur in lines) { 
			if (lines[cur] != "") used_lines.push(lines[cur]); 
		}
		data.content = used_lines.join("\n");
	}
	return data;

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
	} else if (!data.canvas_object) { callback({ error: 1 }); return; }
	var canvas_object = CanvasObject.format_data(data.canvas_object);

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			var update = {}, id = page.project.canvas_objects_created, index = 'pages.' + page.id + '.canvas_objects.' + id;
			update[index] = { top: canvas_object.top, left: canvas_object.left, template_id: canvas_object.template_id, id: id };

			collection.update( { _id: page.project._id },
				{ $set: update, $inc: { canvas_objects_created: 1 } }, {},
			function(err, doc) {
				db.close();
				callback(new CanvasObject(update[index], page));
			});
		});
	});
};

// Updates a canvas_object
//
// Params:
//   data :: a JSON object
//   callback :: a callback function, which is passed a canvas_object
CanvasObject.prototype.update = function(data, callback) {
	data = CanvasObject.format_data(data);
	if (this.error) {
		callback(this);
		return;
	}

	var update = {}, that = this;
	
	for (var i in CanvasObject.editable) {
		var key = CanvasObject.editable[i]
		if (typeof data[key] != 'undefined') {
			update[this.mongo_path() + '.' + key] = data[key];
			this[key] = data[key];
		}
	}

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.update( { _id: that.page.project._id },
			{ $set: update }, { /* options */ }, function(err, statement) {
				db.close();
				callback(that);
			});
		});
	});
};

// Deletes a canvas object
//
// Params:
//   callback :: a callback function, which is passed the canvas object that was deleted
CanvasObject.prototype.delete = function(callback) {
	if (this.error) return;
	var delete_statement = {}, that = this, canvas_object_count = 0;
	delete_statement[this.mongo_path()] = 1;
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.findOne({ _id: that.page.project._id }, function(err, doc) {
				collection.update( { _id: that.page.project._id },
					{ $unset: delete_statement }, {},
					function(err,doc) {
						if (err != null) { that.error = err; }
						db.close();
						callback(that);
				});
			});
		});
	});
};

// Finds and returns a canvas_object by its id within a project's page
//
// Params:
//   canvas_object_id :: id of the canvas_object
//   page :: an instantiated page object
//   callback :: a callback function, which is passed a canvas object
CanvasObject.find = function(canvas_object_id, page, callback) {
	try {
		var canvas_object_data = page.canvas_objects[canvas_object_id];
		canvas_object_data.id; // Forces an error if the id does not exist.
	} catch(e) { callback(new CanvasObject()); return; }
	canvas_object_data.id = canvas_object_id;
	callback(new CanvasObject(canvas_object_data, page));
};

exports.CanvasObject = CanvasObject;
