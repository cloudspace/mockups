function Project(project_data) {
	var that = this;

	this.pages = project_data.pages;
	this.name  = project_data.name;
	this.id    = project_data._id;
	this.hash  = project_data.hash;
	this.path  = '/' + this.id + '/' + this.hash;
	this.current_page = this.find_page_by_id(window.location.hash.split('/')[3]);
	if (!this.current_page) this.current_page = this.pages[0];

	for (var i in this.pages) {
		if (typeof this.pages[i].canvas_objects == 'undefined') this.pages[i].canvas_objects = [];
	}
};

Project.prototype.canvas_object = function (id) {
	for (var i in this.current_page.canvas_objects) { 
		if (this.current_page.canvas_objects[i] != undefined && this.current_page.canvas_objects[i]._id == id) return this.current_page.canvas_objects[i];
	}
	return undefined;
};

// TODO force this to use find_page_index_by_id()
Project.prototype.find_page_by_id = function (id) {
	for (var i in this.pages) { 
		if (this.pages[i] != undefined && this.pages[i]._id == id) { return this.pages[i]; }
	}
	return undefined;
};

Project.prototype.find_page_index_by_id = function (id) {
	for (var i in this.pages) { 
		if (this.pages[i] != undefined && this.pages[i]._id == id) { return i; }
	}
	return undefined;
};

Project.prototype.current_page_path = function () {
	return this.path + '/' + this.current_page._id;
};

// set current_page based on page_id
// sending an invalid page_id will make it default to the first page
Project.prototype.select_page = function (page) {
	if (!page) page = this.current_page;
	$('#mockup_pages a').removeClass('selected');

	if (!this.find_page_by_id(page._id)) {
		for (var i in this.pages) {
			if (this.pages[i]) {
				this.current_page = this.pages[i];
				break;
			}
		}
	} else {
		this.current_page = page;
	}
	jQuery.history.load(this.current_page_path());

	$('#mockup_pages').find('input').blur();
	$('#canvas .canvas_object').remove();
	for (var i in this.current_page.canvas_objects) {
		Renderer.render(this.current_page.canvas_objects[i]);
	}

	$('#page_' + this.current_page._id).addClass('selected');
};

Project.prototype.page_index = function () {
	var $mockup_pages = $('#mockup_pages').html('');
	for (var index in this.pages) {
		var page = this.pages[index];
		$mockup_pages.append(Views.page_listing(page));
	}
	this.select_page(this.current_page);
};

Project.prototype.sync_name = function () {
	$('#project_name_change').find('input').val(this.name);
};

Project.prototype.update_name = function (data) {
	this.name = data.name;
	this.sync_name();
};

// TODO Abstract to 'update_page' ???
Project.prototype.update_page_name = function (page) {
	this.find_page_by_id(page._id).name = page.name;
	this.page_index();
};

Project.prototype.open_input_box = function ($target) {
	$target.addClass('h').siblings('input').removeClass('h').focus();
};



