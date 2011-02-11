function Project(project_data){
	var that = this;

	// set this objs
	this.current_page;
	this.pages = project_data.pages;
	this.name  = project_data.name;
	this.id    = project_data._id;
	this.hash  = project_data.hash;
	this.path  = this.id + '/' + this.hash;

	// set page items
	this.sync_mockup();

	// reset any bindings
	$('#project_name_change').unbind('submit').submit(function(){
		var project_name_input = $(this).find('input');
    env.socket.send({ project_update: { name: project_name_input.val() } });
		project_name_input.val(that.name);
    project_name_input.blur();
		return false;
	});

	$('#mockup_pages li form').live('submit', function(){
		var page_name_input = $(this).find('input');
		var page_id = $(this).attr('data-id');
		var update_message =
			{ page_update:
				{ id: env.project.id, hash: env.project.hash, page: { id: page_id, name: page_name_input.val()} }
			};
		env.socket.send(update_message);
		page_name_input.val(that.pages[page_id].name);
    return false;
  });
}

Project.prototype.current_page_path = function() {
	return this.path + '/' + this.current_page;
};

// set current_page based on page_id
// sending an invalid page_id will make it default to the first page
Project.prototype.select_page = function(page_id) {
	if (!page_id) page_id = this.current_page;

	$('#page_' + this.current_page).removeClass('selected');

	if (!this.pages[page_id]) {
		for (var i in this.pages) {
			if (this.pages.hasOwnProperty(i)) {
				this.current_page = i;
				break;
			}
		}
	} else {
		this.current_page = page_id;
	}
	jQuery.history.load(this.current_page_path());

	$('#canvas .canvas_object').remove();
	for (var i in this.pages[this.current_page].canvas_objects) {
		Renderer.render(this.pages[this.current_page].canvas_objects[i]);
	}

	$('#page_' + this.current_page).addClass('selected');
};

//set page items
Project.prototype.sync_mockup = function(property){
	if (property == undefined) {
		this.sync_name();
		this.sync_pages();
		return;
	}

	if (this['sync_' + property]) this['sync_' + property]();
};

Project.prototype.sync_pages = function(page_id) {
	var $mockup_pages = $("#mockup_pages").html("");
	for (var index in this.pages) {
		var page = this.pages[index], page_name = page.name ? page.name : '&nbsp;';
		$mockup_pages.append(
			'<li>' +
		    '<form data-id="' + index + '" class="name_update">' + // TODO remove h for current_page
					'<a data-id="' + index + '" id="page_' + index + '" ' +
					'   title="' + page.name.replace('"', '&quot;') + '" ' +
					'   href="#' + this.id + '/' + this.hash + '/' + index + '">' +
						page_name +
					'</a>' +
					'<input class="h" type="text" value="' + page.name + '"/>' +
				'</form>' +
				'<span data-id="' + index + '" class="delete"> delete </span>' +
			'</li>'
		);
	}
	this.select_page(page_id);
};

Project.prototype.sync_name = function() {
	$('#project_name_change').find('input').val(this.name);
};

Project.prototype.update_name = function(data){
	this.name = data.name;
	this.sync_name();
};

Project.prototype.update_page_name = function(page){
	this.pages[page.id].name = page.name;
	this.sync_pages(this.current_page);
};

Project.prototype.open_input_box = function($target){
	$target.addClass('h')
		.siblings('input').removeClass('h').focus();
};
Project.prototype.add_canvas_object = function(new_canvas_object){
		var page_id = new_canvas_object.page.id;
		delete new_canvas_object.page;

		var current_canvas_objects = this.pages[page_id].canvas_objects;
		current_canvas_objects[page_id] = new_canvas_object;
		if (this.current_page == page_id) Renderer.render(new_canvas_object);
};
