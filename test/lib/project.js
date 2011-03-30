
var testCase         = require('nodeunit').testCase,
    db               = require('../test_helper').db,
    Project          = require('../../lib/project').Project,
		Page             = require('../../lib/page').Page,
    CanvasObject     = require('../../lib/canvas_object').CanvasObject;

exports.project = testCase({

	setUp: function (callback) {
		var that = this;
		// Clear out the projects collection.
		db.open(function(err, p_db) {
			db.dropCollection('projects', function(err) {
				Project.create(function(project) {
					Page.create(project, function(page) {
						that.project = project;
						that.page    = page;	
						callback();
					});
				});
			});
		});
	},

	tearDown: function (callback) {
		callback();
	},
	"validate_hash: returns an error when passed an invalid hash": function(test) {
		Project.create(function(project) {
			project.validate_hash('bad hash');
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

	"update: updates a project's name": function(test) {
			var project_id = this.project._id;
			this.project.update({ name: 'not a default name' }, function(project) {
				Project.find_by_id(project_id, function(project) {
					test.equal(project.name, 'not a default name');
					test.done();
				});
			});
	},

	"update: does not allow blank project names": function(test) {
		var project_id   = this.project._id;
		var project_name = this.project.name;
		this.project.update({ name: '' }, function(project) {
			Project.find_by_id(project_id, function(project) {
				test.equal(project.name, project_name);
				test.done();
			});
		});
	},

	"Project.find_by_id: returns a project when given a valid id": function(test) {
		Project.find_by_id(this.project._id, function(project) {
			test.notEqual(project, undefined);
			test.done();
		});
	},

	"Project.find_by_id: returns an error when passed an invalid id": function(test) {
		Project.find_by_id('invalid', function(project) {
			test.notEqual(project.error, undefined);
			test.done();
		});
	},
	
	"delete_canvas_objects: returns the canvas_object_ids it deleted from a project": function(test) {
		var that = this;
		CanvasObject.create(that.page, { canvas_object: {} }, function(canvas_object) {
			that.project.delete_canvas_objects([canvas_object.id], canvas_object.page.id , function(canvas_object_ids){
				test.equal(canvas_object_ids[0], canvas_object.id);
				test.done();
			});
		});
	},

	"delete_canvas_objects: after deletion canvas_object should not exist": function(test) {
		var that = this;
		CanvasObject.create(that.page, { canvas_object: {} }, function(canvas_object) {
			that.project.delete_canvas_objects([canvas_object.id], canvas_object.page.id , function(canvas_object_id){
				Page.find_by_id_and_project_id(that.page.id, that.project._id, function(page){
					CanvasObject.find(canvas_object.id, page, function(canvas_object){
						test.equal(canvas_object['error'], '404');	
						test.done();
					});
				});
			});
		});
	},
});


