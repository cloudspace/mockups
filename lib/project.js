
var mongoose  = module.parent.exports.mongoose
  , Schema   = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , crypto = require('crypto');

var CanvasObjects = new Schema({
	template_id      : String
	, top            : Number
	, left           : Number
	, width          : Number
	, height         : Number
	, content        : String
	, fontsize       : Number
});

var Pages = new Schema({
	name             : { type: String, default: 'New Page' }
	, canvas_objects : [CanvasObjects]
});

var Project = new Schema({
	name       : { type: String, default: 'New Project' }
	, hash     : { type: String, default: time_based_md5_substring }
	, salt     : String
	, password : String
	, pages    : { type: [Pages] }
});

mongoose.model('Project', Project);
exports.Project = mongoose.model('Project');

// Generates an md5 based on the current time and returns its first eight characters.
function time_based_md5_substring() {
	return crypto.createHash('md5').update(new Date()).digest('hex').substr(0,8);
}

/*

var Project = function (doc) {
	// The project could not be found.
  if (!doc) {
    this.error = '404';
    return;
  }
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
    // TODO look into calling this a '401' error and any changes necessary on the front-end.
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
//           e.g. { name: 'New Project Name' }
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
			{ $set: update }, { }, function(err, project) {
				callback(project)
			});
		});
	});
};

// Creates a project in MongoDB and returns the document.
//
// Params:
//   callback :: a callback function, which is passed a project
};

// Finds a project in MongoDB by id.
//
// Params:
//   callback :: a callback function, which is passed arguments (err, project)
Project.find_by_id = function(id, callback) {
  if (!id || !callback) return undefined;

  db.open(function(err, p_db) {
    db.collection('projects', function(err, collection) {
      collection.findOne({ _id: id }, function(err, doc) {
        project = new Project(doc);
        callback(project);
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

function encrypt_password(salt,password){
	return crypto.createHash('md5').update(salt + password).digest('hex');
}

*/

