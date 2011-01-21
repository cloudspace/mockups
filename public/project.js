
Project = function () {
	this.id = 0;
	this.json = {};
}

Project.prototype.create = function() {
	console.log('Creating a new project.');
};

Project.prototype.load = function(id) {
	console.log('Loading project with id = ' + id);
	this.id = id;
	socket.send({ get_project: { id: id } });
	// send message to node w/project info
	// NODE should authenticate and return response with actual setting of project
	// response should be loaded into this.json
};

