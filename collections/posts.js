Posts = new Meteor.Collection('posts');

Posts.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	// deny the update if the incoming data contains any properties
	// not included in the list below.
	update: function (userId, post, fieldNames) {
		// may only edit the followin.fetchg two fields
		return (_.without(fieldNames, 'url', 'title', 'message').length > 0 && doc.userId == userId); 
	}
});

Posts.deny({
	// hack to update lastModified date on doc for updates. better to use
	// a method here in lieu of a meteor provided 'beforeUpdate' callback
	update: function (userId, doc) {
		doc.lastModified = +(new Date());
		return false;
	}
});

Meteor.methods({
	// method for submitting new posts
	post: function (attr) {
		// get the currently logged in user and look for other posts with the same url
		var user = Meteor.user(),
			duplicateLink = Posts.findOne({url: attr.url});

		// perform validations
		if (!user) throw new Meteor.Error(401, 'Please login to post stories.');
		if (!attr.title) throw new Meteor.Error(422, 'Please include a headline');
		if (attr.url && duplicateLink) throw new Meteor.Error(302, 'This link has already been posted', duplicateLink._id);

		var whitelist = ['title'];
		whitelist.push(attr.url ? 'url' : 'message');

		// whitelist attributes and add meta info
		var post = _.extend(_.pick(attr, whitelist), {
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime(),
			commentsCount: 0, 
			upvoters: [],
			downvoters: [],
			votes: 0
		});

		// returns new _id
		return Posts.insert(post);
	},

	upvotePost: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		var post = Posts.findOne(id);
		var voteIncrement = _.include(post.downvoters, user._id) ? 2 : 1;

		console.log('up', id);
		console.log('votes', post.votes)
		console.log('inc', voteIncrement);
		Posts.update({
			_id: id,
			upvoters: {$ne: user._id}
		}, { 
			$addToSet: {upvoters: user._id},
			$pull: {downvoters: user._id},
			$inc: {votes: voteIncrement}
		});
	},

	downvotePost: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		var post = Posts.findOne(id);
		var voteIncrement = _.include(post.upvoters, user._id) ? -2 : -1;

		console.log('down', post);
		console.log('votes', post.votes);
		console.log('inc', voteIncrement);
		Posts.update({
			_id: id,
			downvoters: {$ne: user._id} 
		}, { 
			$addToSet: {downvoters: user._id},
			$pull: {upvoters: user._id},
			$inc: {votes: voteIncrement}
		});
	},

	removePostUpvote: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		Posts.update({
			_id: id
		}, { 
			$pull: {upvoters: user._id}, 
			$inc: {votes: -1}
		});
	},

	removePostDownvote: function (id) {
		var user = Meteor.user();
		if (!user) throw new Meteor.Error(401, 'Please login to vote on stories.');

		Posts.update({
			_id: id
		}, { 
			$pull: {downvoters: user._id}, 
			$inc: {votes: 1}
		});
	}
});