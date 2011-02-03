
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Project          = require('../../lib/project').Project,
    Page             = require('../../lib/page').Page;

exports.page = testCase({

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

	"create: creates a new page": function(test) {
		Project.create(function(project) {
			test.equal(project.pages_created, 1);
			Page.create(project, function(page) {
				Project.find_by_id(project._id, function(project) {
					test.equal(project.pages_created, 2);
					test.done();
				});
			});
		});
	},

	"create: returns an error when the project doesn't exist": function(test) {
		Project.find_by_id('this-id-does-not-exist', function(project) {
			Page.create(project, function(page) {
				test.notEqual(page.error, undefined);
				test.done();
			});
		});
	},


/*

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


