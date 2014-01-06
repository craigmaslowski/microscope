Template.commentSubmit.events({
	'submit form': function(e, template) {
		e.preventDefault();

		var $body = $(e.target).find('[name=body]');
		var comment = {
			body: $body.val(),
			postId: template.data._id 
		};

		Meteor.call('comment', comment, function(err, commentId) { 
			if (err){
				Errors.throw(err.reason); 
			} else {
				$body.val(''); 
			}
		}); 
	}
});