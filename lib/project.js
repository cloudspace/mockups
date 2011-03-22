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

CanvasObjects.virtual('json').get(function () {
	return {
		_id           : this._id
		, template_id : this.template_id
		, top         : this.top
		, left        : this.left
		, width       : this.width
		, height      : this.height
		, content     : this.content
		, fontsize    : this.fontsize
		, page        : {
			_id: this.parentArray._parent._id
		},
	};
});

CanvasObjects.virtual('name').get(function () {
	return this.template_id ? this.template_id.replace(/\_/g," ") : '';
});

var Pages = new Schema({
	name             : { type: String, default: 'New Page' }
	, canvas_objects : [CanvasObjects]
});

Pages.virtual('json').get(function () {
	return {
		_id    : this._id
		, name : this.name
	};
});

var Project = new Schema({
	name       : { type: String, default: 'New Project' }
	, hash     : { type: String, default: time_based_md5_substring }
	, salt     : String
	, password : String
	, pages    : [Pages]
});

Project.virtual('json').get(function () {
	return {
		_id     : this._id
		, hash  : this.hash
		, name  : this.name
		, pages : this.pages
	};
});

mongoose.model('Project', Project);
exports.Project = mongoose.model('Project');

// Checks if a password grants proper authorization to a project.
exports.Project.prototype.authorize = function (password) {
	return (hash_salted_password(this.salt, password) == this.password) ? true : false;
};

// Create salt and hash the password
exports.Project.prototype.set_salt_and_password = function (password) {
	this.salt = generate_salt();
	this.password = hash_salted_password(this.salt, password);
};

// Generates an md5 based on the current time and returns its first eight characters.
function time_based_md5_substring() {
	return crypto.createHash('md5').update(new Date()).digest('hex').substr(0,8);
}

// Generates a salt for passwords
// Inspiration: http://www.mediacollege.com/internet/javascript/number/random.html
function generate_salt() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz$/", salt_length = 12, salt = '';
	for (var i = 0; i < salt_length; i++) salt += chars[Math.floor(Math.random() * chars.length)];
	return salt;
}

// Hashes a password with its salt
function hash_salted_password(salt, password) {
	return crypto.createHash('md5').update(salt + password).digest('hex');
}

