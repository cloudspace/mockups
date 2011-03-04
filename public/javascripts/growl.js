

Growl = function(message) {
	var $notify = $('<div class="rad5 notify">' + message + '<div>');
	$('#growl').append($notify.hide().fadeIn());

	// Delete notifications if there are more than 5.
	var growl_length = $('#growl .notify').length;
	if (growl_length > 5) $('#growl .notify:lt(' + (growl_length - 5) + ')').remove();

	setTimeout(function() {
		if ($notify) {
			$notify.fadeOut(function() {
				$(this).remove();
			});
		}
	}, 6000);
};

