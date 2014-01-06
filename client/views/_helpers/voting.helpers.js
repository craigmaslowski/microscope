VotingHelpers = {
	upvotedClass: function () {
		var userId = Meteor.userId();
		if (userId && !_.include(this.upvoters, userId) && this.userId != userId) {
			return 'upvotable'; 
		} else if (userId && _.include(this.upvoters, userId) && this.userId != userId) {
			return 'upvoted';
		} else {
			return 'disabled'; 
		}
	},

	downvotedClass: function () {
		var userId = Meteor.userId();
		if (userId && !_.include(this.downvoters, userId) && this.userId != userId) {
			return 'downvotable'; 
		} else if (userId && _.include(this.downvoters, userId) && this.userId != userId) {
			return 'downvoted';
		} else {
			return 'disabled'; 
		}
	}
};

var voteClickHandler = function (e) {
	e.preventDefault();
	var user = Meteor.user();
	if (!user) Errors.throw('Please login to vote on stories');
}

PostVotingEvents = {
	'click .upvote': voteClickHandler,
	'click .downvote': voteClickHandler,

	'click .upvotable': function (e) {
		Meteor.call('upvotePost', this._id);
	},

	'click .upvoted': function (e) {
		Meteor.call('removePostUpvote', this._id)
	},

	'click .downvotable': function (e) {
		Meteor.call('downvotePost', this._id);
	},

	'click .downvoted': function (e) {
		Meteor.call('removePostDownvote', this._id)
	}
}

CommentVotingEvents = {
	'click .upvote': voteClickHandler,
	'click .downvote': voteClickHandler,

	'click .upvotable': function (e) {
		Meteor.call('upvoteComment', this._id);
	},

	'click .upvoted': function (e) {
		Meteor.call('removeCommentUpvote', this._id)
	},

	'click .downvotable': function (e) {
		Meteor.call('downvoteComment', this._id);
	},

	'click .downvoted': function (e) {
		Meteor.call('removeCommentDownvote', this._id);
	},
};
