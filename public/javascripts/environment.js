Environment = function(){
	this.socket;
	this.project;
	var that = this;
	$.get("/templates.json", function(response) {
		that.templates = JSON.parse(response);
	});
};

Environment.prototype.connect = function(){
	var that = this;

	this.socket = new io.Socket(null, {port: 8080, rememberTransport: false, tryTransportsOnConnectTimeout: false});
	this.socket.connect();

	this.socket.on('message', function(obj) { MessageProcessor.process(obj); });
	this.socket.on('connect',function(obj) {
		$.fancybox.close();
		that.display_name = 'Anonymous';
		reset_display_name();
		$.history.init(load_hash, { 'unescape': '/' });
	});
	this.socket.on('disconnect', function(){
		$("#disconnected").fancybox({
			'autoScale'         : false,
			'enableEscapeButton': false,
			'showCloseButton'   : false,
			'hideOnOverlayClick': false,
			'hideOnContentClick': false,
			'content'           : $("#disconnected").html()
		}).trigger("click");
		that.initialize_reconnect.call(that);
	});
	return true;
};

Environment.prototype.initialize_reconnect = function(){
	if (this.show_countdown_timer) clearTimeout(this.show_countdown_timer);
	if (this.countdown_timer) clearTimeout(this.countdown_timer);
	if (this.reconnect_timer) clearTimeout(this.reconnect_timer);
	this.reset_time = 4000;
	this.attempt_reconnect.call(this);
	this.countdown.call(this);
}

Environment.prototype.attempt_reconnect = function(){
	if(this.socket.connected == true) return;
	var that = this;

	this.reconnect_timer = setTimeout(function(){
		that.attempt_reconnect.call(that);
	}, this.reset_time + 2000);

	this.hide_countdown();
	this.show_countdown_timer = setTimeout(function(){
		that.show_countdown.call(that);
	}, 2000);

	this.socket.connect();
};

Environment.prototype.show_countdown = function(){
	$('#fancybox-content .wait_time').text((this.reset_time + 1000)/1000);
	$('#fancybox-content .reconnect').hide();
	this.reset_time = this.reset_time * 2 < 29000 ? this.reset_time * 2 : 29000;
	$('#fancybox-content .countdown').show();
};

Environment.prototype.hide_countdown = function(){
	$('#fancybox-content .reconnect').show();
	$('#fancybox-content .countdown').hide();
};

Environment.prototype.countdown = function(){
	if(this.socket.connected == true) return;
	var time_span = $("#fancybox-content .wait_time"),
			that = this,
			time = parseInt(time_span.text());

	time = time > 0? time - 1: 0;
	time_span.text(time);
	this.countdown_timer = setTimeout(function(){
		that.countdown.call(that);
	},1000);
};
Environment.prototype.render = function(canvas_object){
	Render[canvas_object.template_id](canvas_object);
};

