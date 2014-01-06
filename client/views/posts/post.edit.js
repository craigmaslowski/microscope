Template.postEdit.messagePreview = MessagePreview;
Template.postEdit.destroyed = PostFormDestroyedHandler;

Template.postEdit.events(_.extend({
	'submit form': function (e) {
		e.preventDefault();
		var currentPostId = this._id;

		var attrs = {
			url: $(e.target).find('[name=url]').val(), 
			title: $(e.target).find('[name=title]').val(),
			message: $(e.target).find('[name=message]').val()
		};

		Posts.update(currentPostId, {$set: attrs}, function (err) {
			if (err) 
				Errors.throw('err.reason');
			else 
				Router.go('postPage', {_id: currentPostId});
		});
	},

	'click .delete': function (e) {
		e.preventDefault();

		if (confirm('Delete this post?')) {
			Posts.remove(this._id);
			Router.go('postsList');
		}
	}
}, PostFormEvents));

/*Template.postEdit.rendered = function () {
	if (this.data.url) {
		$('.url-control-group', '.post-form').show();
		$('.message-control-group', '.post-form').hide();
	} else {
		$('.url-control-group', '.post-form').hide();
		$('.message-control-group', '.post-form').show();
	} 
};*/