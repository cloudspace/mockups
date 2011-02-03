
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

	"Project.find_by_id: returns a project when given a valid id": function(test) {
		Project.create(function(project) {
			Project.find_by_id(project._id, function(project) {
				test.notEqual(project, undefined);
				test.done();
			});
		});
	},

	"Project.find_by_id: returns an error when passed an invalid id": function(test) {
		Project.find_by_id('invalid', function(project) {
			test.notEqual(project.error, undefined);
			test.done();
		});
	},

	"authorize: returns an error when passed an invalid hash": function(test) {
		Project.create(function(project) {
			project.authorize('bad hash');
			test.notEqual(project.error, undefined);
			test.done();
		});
	},

	"create: creates a new project": function(test) {
		Project.create(function(project) {
			test.notEqual(project, undefined);
			test.done();
		});
	},

/*


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

	"Project.delete_page: deletes a page": function(test) {
		new Project(function(project) {
			Project.delete_page(project._id, '0', function(err, doc) {
				db.open(function(err, p_db) {
					db.collection('projects', function(err, collection) {
						collection.findOne({ _id: project._id }, function(err, doc) {
							test.equal(doc.pages['1'], undefined);
							test.done();
						});
					});
				});
			});
		});
	},
*/

});


