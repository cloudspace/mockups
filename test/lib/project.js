
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Project          = require('../../lib/project').Project;

exports.project = testCase({

	setUp: function (callback) {
		// Clear out the projects collection.
		db.open(function(err, p_db) {
			db.dropCollection('projects', function(err) {
				callback();
			});
		});
	},

	tearDown: function (callback) {
		callback();
	},

	"Project.find: returns a project when given a valid id and hash": function(test) {
		new Project(function(project) {
			Project.find({ id: project._id, hash: project.hash }, function(err, doc) {
				test.notEqual(doc, undefined);
				test.equal(err, undefined);
				test.done();
			});
		});
	},

	"Project.find: returns an error when passed an invalid id": function(test) {
		new Project(function(project) {
			Project.find({ id: 'invalid', hash: project.hash }, function(err, doc) {
				test.equal(doc, undefined);
				test.notEqual(err, undefined);
				test.done();
			});
		});
	},

	"Project.find: returns an error when passed an invalid hash": function(test) {
		new Project(function(project) {
			Project.find({ id: project._id, hash: 'invalid' }, function(err, doc) {
				test.equal(doc, undefined);
				test.notEqual(err, undefined);
				test.done();
			});
		});
	},

	"Project.find: returns an error when passed nothing": function(test) {
		new Project(function(project) {
			Project.find(undefined, function(err, doc) {
				test.equal(doc, undefined);
				test.notEqual(err, undefined);
				test.done();
			});
		});
	},

	"new Project: creates a new project": function(test) {
		var project = new Project(function(project) {
			test.notEqual(project, undefined);
			test.done();
		});
	},

	"Project.add_page: creates a new page": function(test) {
		new Project(function(project) {
			Project.add_page(project._id, function(err, doc) {
				// pages.0 (Home) already exists, add pages.1
				test.equal(doc['pages.1'].name, 'New Page');

				Project.add_page(project._id, function(err, doc) {
					// add pages.2
					test.equal(doc['pages.2'].name, 'New Page');
					test.done();
				});
			});
		});
	},

});


