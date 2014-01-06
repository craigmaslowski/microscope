PostsListController = RouteController.extend({ 
	template: 'postsList',
	increment: 10,

	limit: function() {
		return parseInt(this.params.limit) || this.increment; 
	},

	findOptions: function() {
		return {
			sort: this.sort,
			limit: this.limit()
		};
	},

	waitOn: function() {
		return Meteor.subscribe('posts', this.findOptions()); 
	},

	data: function() {
		return {
			posts: Posts.find({}, this.findOptions()),
			nextPath: this.nextPath()
		};
	} 
});

NewPostsListController = PostsListController.extend({
	sort: {submitted: -1, _id: -1},
	
	nextPath: function () {
		return Router.routes.newPosts.path({limit: this.limit() + this.increment});
	}
});

BestPostsListController = PostsListController.extend({
	sort: {votes: -1, submitted: -1, _id: -1},
	
	nextPath: function () {
		return Router.routes.bestPosts.path({limit: this.limit() + this.increment});
	}
});

UsersPostsListController = PostsListController.extend({
	sort: {submitted: -1, _id: -1},
	
	waitOn: function() {
		return Meteor.subscribe('usersPosts', this.params.userId, this.findOptions()); 
	},

	nextPath: function () {
		return Router.routes.usersPosts.path({userId: this.params.userId, limit: this.limit() + this.increment});
	},
	
	data: function() {
		return {
			posts: Posts.find({userId: this.params.userId}, this.findOptions()),
			nextPath: this.nextPath()
		};
	}
});
