var converter = new Showdown.converter();

MessagePreview = function () { 
	if (!Session.get('messagePreview')) {
		Session.set('messagePreview', this.message);
	}
	return Session.get('messagePreview'); 
};

PostFormDestroyedHandler = function () {
	Session.set('messagePreview', 'A preview of your message will appear here when you start typing.');
};

PostFormEvents = {
	'keyup textarea[name=message]': function (e) {
		Session.set('messagePreview', $(e.currentTarget).val());
	}
};
