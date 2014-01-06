Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function (attrs) {
		var user = Meteor.user();
		var post = Posts.findOne(attrs.postId);

		if (!user) throw new Meteor.Error(401, "You need to login to make comments"); 
		if (!attrs.body) throw new Meteor.Error(422, 'Please write some content'); 
		if (!attrs.postId) throw new Meteor.Error(422, 'You must comment on a post');

		comment = _.extend(_.pick(attrs, 'postId', 'body'), { 
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime(),
			upvoters: [],
			votes: 0
		});
		
		Posts.update(comment.postId, {$inc: {commentsCount: 1}});

		comment._id = Comments.insert(comment);
		createCommentNotification(comment);

		return comment._id;
	},

	upvoteComment: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');
		
		var comment = Comments.findOne(id);
		var voteIncrement = _.include(comment.downvoters, user._id) ? 2 : 1;

		Comments.update({
			_id: id,
			upvoters: {$ne: user._id}
		}, { 
			$addToSet: {upvoters: user._id}, 
			$pull: {downvoters: user._id},
			$inc: {votes: voteIncrement}
		});
	},

	downvoteComment: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		var comment = Comments.findOne(id);
		var voteIncrement = _.include(comment.upvoters, user._id) ? -2 : -1;

		Comments.update({
			_id: id,
			downvoters: {$ne: user._id} 
		}, { 
			$addToSet: {downvoters: user._id},
			$pull: {upvoters: user._id},
			$inc: {votes: voteIncrement}
		});
	},

	removeCommentUpvote: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		Comments.update({
			_id: id
		}, { 
			$pull: {upvoters: user._id}, 
			$inc: {votes: -1}
		});
	},

	removeCommentDownvote: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		Comments.update({
			_id: id
		}, { 
			$pull: {downvoters: user._id}, 
			$inc: {votes: 1}
		});
	}
});
