
var testCase         = require('nodeunit').testCase,
    db               = require('../test_helper').db,
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
		Project.create(function(project) {
			var project_id = project._id;
			project.update({ name: 'not a default name' }, function(project) {
				Project.find_by_id(project_id, function(project) {
					test.equal(project.name, 'not a default name');
					test.done();
				});
			});
		});
	},

	"update: does not allow blank project names": function(test) {
		Project.create(function(project) {
			var project_id = project._id;
			var project_name = project.name;
			project.update({ name: '' }, function(project) {
				Project.find_by_id(project_id, function(project) {
					test.equal(project.name, project_name);
					test.done();
				});
			});
		});
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

});


