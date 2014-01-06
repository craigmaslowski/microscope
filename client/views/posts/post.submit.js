Template.postSubmit.messagePreview = MessagePreview;
Template.postSubmit.destroyed = PostFormDestroyedHandler;

Template.postSubmit.events(_.extend({
	'submit form': function (e) {
		e.preventDefault();

		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val(), 
			message: $(e.target).find('[name=message]').val()
		};

		Meteor.call('post', post, function (err, id) {
			if (err) {
				Errors.throw(err.reason);
				if (err.error === 302) {
					Router.go('postPage', {_id: err.details});
				}
			} else {
				Router.go('postPage', {_id: id});
			}
		});
	},

	'click .nav-tabs a': function (e) {
		e.preventDefault();
		var $tab = $(e.currentTarget).parent();
		$('.nav-tabs li', '.post-form').removeClass('active');
		$tab.addClass('active');
		if ($tab.hasClass('message')) {
			$('.url-control-group', '.post-form').hide();
			$('.message-control-group', '.post-form').show();
		} else if ($tab.hasClass('url')) {
			$('.url-control-group', '.post-form').show();
			$('.message-control-group', '.post-form').hide();
		}
	}
}, PostFormEvents));