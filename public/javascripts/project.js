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

     env.socket.send({ update_project: { id: env.project.id, hash: env.project.hash, name: project_name_input.val() } });
     project_name_input.blur();
     return false;
   });

	$('#mockup_pages li form').unbind('submit').submit(function(){
		var page_name_input = $(this).find('input');
		var page_id = $(this).attr('data-id');
		var update_message =
			{ update_project:
				{ id: env.project.id, hash: env.project.hash, pages: {} }
			};
		update_message.update_project.pages[page_id] = { name: page_name_input.val() };
		env.socket.send(update_message);
    page_name_input.blur();
    return false;
  });
}

//set page items
Project.prototype.sync_mockup = function(property){
	var that = this;
			mockup_sync_project_name = function(){
				$('#project_name_change').find('input').val(that.name);
			},
			mockup_sync_pages = function(){
				var mockup_pages = $("#mockup_pages ul").html("");
				for( index in that.pages){
					var page = that.pages[index];
					var span = $("<form><input type='text' value='" + page.name.toLowerCase() + "'/></form>").attr('data-id', index);
					$('<li>/</li>').append(span).appendTo(mockup_pages);
				}
			};

	if(property == undefined){
		mockup_sync_project_name();
		mockup_sync_pages();
		return;
	}

	switch(property)
	{
		case 'name':
			mockup_sync_project_name();
			break;
		case 'pages':
			mockup_sync_pages();
			break;
		default:
			console.log("The Project object can't handle your crazy call to sync" + property);
	}

};
Project.prototype.set_user_name = function(){

};
Project.prototype.set_page_name = function(){

};
