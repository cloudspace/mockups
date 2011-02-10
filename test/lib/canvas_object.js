
var testCase         = require('nodeunit').testCase,
    it               = require('../test_helper').it,
    db               = require('../test_helper').db,
    ObjectID         = require('mongodb').ObjectID,
    Project          = require('../../lib/project').Project,
    Page             = require('../../lib/page').Page;
    CanvasObject     = require('../../lib/canvas_object').CanvasObject;

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

	"create: creates a new canvas object": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				CanvasObject.create(page, function(canvas_object) {
					test.equal(canvas_object.error, undefined);
					test.done();
				});
			});
		});
	},

	"create: updates the canvas_objects_created counter": function(test) {
		Project.create(function(project) {
			test.equal(project.canvas_objects_created, 0);
			Page.create(project, function(page) {
				CanvasObject.create(page, function(canvas_object) {
					Project.find_by_id(project._id, function(project) {
						test.equal(project.canvas_objects_created, 1);
						test.done();
					});
				});
			});
		});
	},

	"create: returns an error when the page doesn't exist": function(test) {
		Project.create(function(project) {
			Page.find_by_id_and_project_id('this-id-does-not-exist', project._id, function(page) {
				CanvasObject.create(page, function(canvas_object) {
					test.notEqual(canvas_object.error, undefined);
					test.done();
				});
			});
		});
	},

});


