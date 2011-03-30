var db  = module.parent.exports.db
, ObjectID = require('mongodb').ObjectID
, crypto = require('crypto');

// Instantiates a Project object based upon a JSON object.
//
// Params:
//   doc :: a JSON object / document from MongoDB
//          e.g. { _id: ..., name: "A Project", hash: "abcdef12", pages: {...}, pages_created: 1 }
var Project = function (doc) {
	// The project could not be found.
	if (!doc) {
		this.error = '404';
		return;
	}

	this._id   = doc._id;
	this.name  = doc.name;
	this.hash  = doc.hash;
	this.salt  = doc.salt;
	this.pages = doc.pages;
	this.password = doc.password;
	this.pages_created = doc.pages_created;
	this.canvas_objects_created = doc.canvas_objects_created;
};

// Authorizes a client to edit a non-password protected project, checking the input hash against this object's hash.
//
// Params:
//   hash :: a string
Project.prototype.validate_hash = function(hash) {
	if (hash == this.hash) {
		return true;
	} else {
		// The project could not be authorized with the given credentials.
		this.error = '404'
		return false;
	}
};

Project.prototype.authorize = function(password) {
	return (encrypt_password(this.salt, password) == this.password) ? true : false;
}

// Updates the base-level of a project document in MongoDB with the given data.
//
// Params:
//   data :: a JSON object
//     example: { name: 'New Project Name' }
//   callback :: a callback function, which is passed a project
Project.prototype.update = function(data, callback) {
	if (this.error) {
		callback(this);
		return;
	}

	var update = {}, that = this;
	if (data.name && data.name != '') update.name = data.name;
	if (typeof data.password != 'undefined') {
		update.salt = generate_salt();
		update.password = encrypt_password(update.salt, data.password); 
	}

	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.update( { _id: that._id },
			{ $set: update }, { /* options */ }, function(err, project) {
				db.close();
				callback(project)
			});
		});
	});
};

// Creates a project in MongoDB and returns the document.
//
// Params:
//   callback :: a callback function, which is passed a project
Project.create = function(callback) {
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			collection.insert({
				name: 'New Project',
				// creates a hash from md5 of the current time
				hash: crypto.createHash('md5').update(new Date()).digest('hex').substr(0,8),
				pages_created: 1,
				canvas_objects_created: 0,
				pages: { '0': { name: 'home', canvas_objects: {} } }
			}, function(err, docs) {
				project = new Project(docs[0]);
				db.close();
				callback(project);
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
				db.close();
				callback(project);
			});
		});
	});
};
// Returns the path to the current canvas object in mongo
//
// e.g. returns "pages.12.canvas_objects.15" for a canvas object with id 15 on page 12
Project.prototype.canvas_object_mongo_path = function(canvas_object_id, page_id) { 
	return 'pages.' + page_id + '.canvas_objects.' + canvas_object_id; 
};

Project.prototype.delete_canvas_objects = function(canvas_object_ids, page_id, callback){
	if (this.error) return;
	var delete_statement = {}, that = this, canvas_object_count = 0;
	canvas_object_ids.forEach(function(canvas_object){
		delete_statement[that.canvas_object_mongo_path(canvas_object.id, page_id)] = 1;
	});
	db.open(function(err, p_db) {
		db.collection('projects', function(err, collection) {
			
			collection.findOne({ _id: that._id }, function(err, doc) {
				collection.update( { _id: that._id },
					{ $unset: delete_statement }, {},
					function(err,doc) {
						if (err != null) { that.error = err; }
						db.close();
						callback(canvas_object_ids);
				});
			});
		});
	});

};

exports.Project = Project;

// Generates a salt for password
//
// Inspiration: http://www.mediacollege.com/internet/javascript/number/random.html
function generate_salt() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz$/", salt_length = 12, salt = '';
	for (var i = 0; i < salt_length; i++) salt += chars[Math.floor(Math.random() * chars.length)];
	return salt;
}

function encrypt_password(salt, password) {
	return crypto.createHash('md5').update(salt + password).digest('hex');
}

