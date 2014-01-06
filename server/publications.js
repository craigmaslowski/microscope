Meteor.publish('posts', function (options) {
	return Posts.find({}, options);
});

Meteor.publish('usersPosts', function (userId, options) {
	return Posts.find({userId: userId}, options);
});

Meteor.publish('singlePost', function (id) {
	return id && Posts.find(id);
});

Meteor.publish('comments', function (postId) {
	return Comments.find({postId: postId}, {sort: {votes: -1}});
});

Meteor.publish('notifications', function() { 
	return Notifications.find({userId: this.userId});
});