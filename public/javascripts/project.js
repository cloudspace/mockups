
Project = function () {
	this.id = 0;
	this.json = {};
}

Project.prototype.create = function() {
	env.socket.send({ create_project: {} });
};

Project.prototype.load = function(id) {
	this.id = id;
	env.socket.send({ find_project: { id: id } });
	// send message to node w/project info
	// NODE should authenticate and return response with actual setting of project
	// response should be loaded into this.json
};

