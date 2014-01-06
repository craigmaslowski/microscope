Template.postPage.helpers({
	rankedComments: function () {
		var comments = Comments.find({postId: this._id}, {sort: {votes: -1}});
		return comments.map(function(comment, index, cursor) {
			comment._rank = index;
			return comment; 
		});
	}
});