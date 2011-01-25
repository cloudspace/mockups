Environment = function(){
	that = this;
	that.socket;
	that.reset_time = 10000;
	that.project;
};

Environment.prototype.connect = function(){
	that.socket = new io.Socket(null, {port: 8080, rememberTransport: false});
	that.socket.connect();
	
	that.display_name = 'Anonymous';
	that.project = new Project();
	
	that.socket.on('message', function(obj) { MessageProcessor.process(obj); });
	that.socket.on('connect',function(obj) { $.fancybox.close(); that.reset_time = 10000;});
	that.socket.on('disconnect', function(){
		$("#disconnected").fancybox({
			'autoScale'   			: false,
			'enableEscapeButton': false,
			'showCloseButton'		: false,
			'hideOnOverlayClick': false,
			'hideOnContentClick': false,
			'content'						: $("#disconnected").html()
		}).trigger("click");
		that.attempt_reconnect();
		that.countdown();
		});
	return true;
};

Environment.prototype.attempt_reconnect = function(){
	if(that.socket.connected == false){ 	
		setTimeout('that.attempt_reconnect()', that.reset_time);
		$('#fancybox-content .time_til_reconnect').text(that.reset_time/1000);
		$('#fancybox-content .countdown').hide();
		$('#fancybox-content .reconnect').show();
		setTimeout('that.update_visible_message()',10000);
		that.reset_time = that.reset_time * 2 < 40000 ? that.reset_time * 2 : 40000;
	}else{
		return;
	}
	that.connect();
};

Environment.prototype.update_visible_message = function(){
	$('#fancybox-content .reconnect').hide();
	$('#fancybox-content .countdown').show();
};

Environment.prototype.countdown = function(){
	var time_span = $("#fancybox-content .time_til_reconnect") 
			time = parseInt(time_span.text());
	if(time > 0) {
		time_span.text(--time);
		setTimeout('that.countdown()',1000);
	}
};

