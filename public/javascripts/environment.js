Environment = function() {
	this.connected = false;
	this.socket;
	this.project;
	var that = this;
};

Environment.prototype.connect = function() {
	var that = this;

	this.socket = new io.Socket(null, { port: 8080, rememberTransport: true, tryTransportsOnConnectTimeout: true });

	this.socket
	.on('message', function(obj) {
		MessageProcessor.process(obj);
	})
	.on('connect',function(obj) {
		$('#reconnect').dialog('destroy').remove();
		if (that.show_countdown_timer) clearTimeout(that.show_countdown_timer);
		if (that.countdown_timer) clearTimeout(that.countdown_timer);
		if (that.reconnect_timer) clearTimeout(that.reconnect_timer);

		that.display_name = 'Anonymous';
		reset_display_name();
		$.history.init(load_hash, { 'unescape': '/' });
	})
	.on('disconnect', function() {
		delete that.project;
		$('#canvas').html('');
		$('.canvas_object_edit').remove();

		that.initialize_reconnect.call(that);
	});

	this.socket.connect();
	return true;
};

Environment.prototype.initialize_reconnect = function() {
	if (this.show_countdown_timer) clearTimeout(this.show_countdown_timer);
	if (this.countdown_timer) clearTimeout(this.countdown_timer);
	if (this.reconnect_timer) clearTimeout(this.reconnect_timer);
	this.reset_time = 4000;
	this.attempt_reconnect.call(this);
	this.countdown.call(this);

};

Environment.prototype.attempt_reconnect = function() {
	if (this.socket.connected == true) return;
	var that = this;

	this.reconnect_timer = setTimeout(function() {
		that.attempt_reconnect.call(that);
	}, this.reset_time + 2000);

	this.hide_countdown();
	this.show_countdown_timer = setTimeout(function() {
		that.show_countdown.call(that);
	}, 2000);

	this.socket.connect();
};

Environment.prototype.show_countdown = function() {
	$('#reconnect').dialog('destroy').remove();
	$(Views.reconnect( Math.ceil((this.reset_time + 1000) / 1000) )).dialog({
		title: 'Connection Lost',
		resizable: false,
		minHeight: 50,
		modal: true,
		zIndex: 10000,
	});
	this.reset_time = this.reset_time * 2 < 30000 ? this.reset_time * 2 : 30000;
};

Environment.prototype.hide_countdown = function() {
	$('#reconnect').dialog('destroy').remove();
	$('<div id="reconnect">Reconnecting.<br/><div id="wait"></div></div>').dialog({
		title: 'Connection Lost',
		resizable: false,
		minHeight: 50,
		modal: true,
		zIndex: 10000,
	});
};

Environment.prototype.countdown = function() {
	if (this.socket.connected == true) return;
	var time_span = $("#reconnect .wait"),
			that = this,
			time = parseInt(time_span.text());

	time = time > 0 ? time - 1 : 0;
	time_span.text(time);
	this.countdown_timer = setTimeout(function() {
		that.countdown.call(that);
	}, 1000);
};

