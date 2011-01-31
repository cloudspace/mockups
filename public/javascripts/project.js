function Project(project_data){
	//set this objs
	this.pages = project_data.pages;
	this.name  = project_data.name;
	this.id    = project_data._id;
	this.hash  = project_data.hash;
	this.path  = this.id + '/' + this.hash;
	//set page items
  this.sync_mockup();
	
	//reset any bindings
  $('#project_name_change').unbind('submit').submit(function(){
		var project_name_input = $(this).find('input');
     env.socket.send({ update_project: { name: project_name_input.val() } });
     project_name_input.blur();
     return false;
   });

   $('#mockup_pages li form').unbind('submit').submit(function(){
		 var page_name_input = $(this).find('input');
		 env.socket.send({ update_project: { page: { name: page_name_input.val(), id : $(this).attr('data-id') } } });
     page_name_input.blur();
     return false;
   });
}

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
		var span = $("<form><input type='text' value='" + page.name.toLowerCase() + "'/></form>").attr('data-id', index);
		$('<li>/</li>').append(span).appendTo(mockup_pages);
	}
};

Project.prototype.sync_name = function() {
	$('#project_name_change').find('input').val(this.name);
};


Project.prototype.set_user_name = function(){
};

Project.prototype.set_page_name = function(){
};

