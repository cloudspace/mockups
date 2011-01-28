function Project(project_data){
	//set this objs
	this.pages = project_data.pages;
	this.name  = project_data.name;
	this.id    = project_data.id;
	this.hash  = project_data.hash;

	//set page items
  this.sync_mockup();
	
	//reset any bindings
  $('#name_change').submit(function(){
     env.socket.send({ update_user: { name: $('#display_name').val() } });
     $(this.input).blur();
     return false;
  });
  $('#project_name_change').submit(function(){
     env.socket.send({ update_project: { name: $('#project_display_name').val() } });
     $(this.input).blur();
     return false;
   }); 
  /* $('.mockup_objects li').submit(function(event){
     var page_name_input = $(event.currentTarget).find('form input');
     env.socket.send({ update_project: { page: { name: page_name_input.val(), id : page_name_input.attr('data-id') } } });
     $(page.input).blur();
     return false;
   });*/
}

//set page items
Project.prototype.sync_mockup = function(property){
	console.log(this.pages);
	var that = this,
			mockup_sync_project_name = function(){ 
				$('#project_name_change').find('input').val(that.name);
			},
			mockup_sync_pages = function(){
				that.pages.forEach(function(page,index){
					var span = $("<span>" + page.name.toLowerCase() + "</span>").attr('data-id', index);
					$('<li>/</li>').append(span).appendTo("#mockup_pages ul");

				});
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
