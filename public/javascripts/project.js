function Project(project_data){
	var that = this;

	// set this objs
	this.pages = project_data.pages;
	this.name  = project_data.name;
	this.id    = project_data._id;
	this.hash  = project_data.hash;
	this.path  = this.id + '/' + this.hash;
	this.select_page();

	// set page items
	this.sync_mockup();

	// reset any bindings
	$('#project_name_change').unbind('submit').submit(function(){
		var project_name_input = $(this).find('input');
    env.socket.send({ update_project: { id: env.project.id, hash: env.project.hash, name: project_name_input.val() } });
		project_name_input.val(that.name);
    project_name_input.blur();
		return false;
	});

	$('#mockup_pages li form').live('submit', function(){
		var page_name_input = $(this).find('input');
		var page_id = $(this).attr('data-id');
		var update_message =
			{ update_pages:
				{ id: env.project.id, hash: env.project.hash, pages: {} }
			};
		update_message.update_pages.pages[page_id] = { name: page_name_input.val() };
		env.socket.send(update_message);
		page_name_input.val(that.pages[page_id].name);
    page_name_input.blur();
    return false;
  });
}

// set current_page based on page_id
// sending an invalid page_id will make it default to the first page
Project.prototype.select_page = function(page_id) {
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

Project.prototype.sync_pages = function() {
	var mockup_pages = $("#mockup_pages").html("");
	for (var index in this.pages) {
		var page = this.pages[index];
		//var span = $("<form class='name_update'><input type='text' value='" + page.name.toLowerCase() + "'/></form><span class='delete'> delete </span>").attr('data-id', index);
		var span = $('<a title="' + page.name.replace('"', '&quot;') + '" href="#' + this.id + '/' + this.hash + '/' + index + '">' + page.name + '</a><span class="delete"> delete </span>');
		$('<li>/</li>').append(span).appendTo(mockup_pages);
	}
};

Project.prototype.sync_name = function() {
	$('#project_name_change').find('input').val(this.name);
};


Project.prototype.update_name = function(update_data){
	this.name = update_data.name;
	this.sync_name();
};

Project.prototype.update_page_name = function(update_data){
	var pages = update_data.pages;
	for (var index in pages) { this.pages[index] = pages[index]; }
	this.sync_pages();
};

