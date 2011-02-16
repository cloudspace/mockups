
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
				test.equal(project.pages_created, page.id);
				test.equal(page.error, undefined);
				test.done();
			});
		});
	},

	"create: updates the pages_created counter": function(test) {
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

	"delete: returns the page it deleted from a project": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				page.delete( function(deleted_page) {
					test.equal(JSON.stringify(page),JSON.stringify(deleted_page));
					test.done();
				});
			});
		});
	},

	"delete: after deletion page should not exist": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				page.delete(function(deleted_page) {
					Page.find_by_id_and_project_id(deleted_page.id, deleted_page.project._id, function(page) {
						test.equal(page.error, '404');
						test.done();
					});
				});
			});
		});
	},

	"update: updates the name attribute a page": function(test) {
		Project.create(function(project) {
			Page.find_by_id_and_project_id(0, project._id, function(page) {
				page.update({ name: 'frank', id: 0 }, function(updated_page) {
					test.equal(updated_page.name, 'frank');
					test.done();
				});
			});
		});
	},

	"Page.find_by_id_and_project_id: returns a page ": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				Page.find_by_id_and_project_id(page.id, project._id, function(found_page) {
					test.equal(found_page.error, undefined);
					test.equal(found_page.project.error, undefined);
					test.done();
				});
			});
		});
	},

	"Page.find_by_id_and_project_id: returns an error if page not found ": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				Page.find_by_id_and_project_id('invalid id', project._id, function(found_page) {
					test.equal(found_page.error, '404');
					test.done();
				});
			});
		});
	},

	"Page.find_by_id_and_project_id: returns an error if project not found ": function(test) {
		Project.create(function(project) {
			Page.create(project, function(page) {
				Page.find_by_id_and_project_id(page.id, 'invalid id', function(found_page) {
					test.equal(found_page.error, '404');
					test.done();
				});
			});
		});
	},

});

