var requireLogin = function () {
	if (!Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');
		}

		this.stop();
	}
};

Router.configure({ 
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { 
		return [
			Meteor.subscribe('notifications')
		];
	}
});

Router.before(requireLogin, {only: 'postSubmit'});
Router.before(function() { Errors.clearSeen() });

Router.map(function() { 
	this.route('home', {
		path: '/',
		controller: BestPostsListController
	});

	this.route('newPosts', {
		path: '/new/:limit?', 
		controller: NewPostsListController
	});

	this.route('bestPosts', {
		path: '/best/:limit?', 
		controller: BestPostsListController
	});

	this.route('usersPosts', {
		path: '/u/:userId/:limit?', 
		controller: UsersPostsListController
	})

	this.route('postPage', {
		path: '/posts/:_id',
		waitOn: function() {
			return [
				Meteor.subscribe('singlePost', this.params._id), 
				Meteor.subscribe('comments', this.params._id)
			];
		},
		data: function () {
			return Posts.findOne(this.params._id);
		}
	});

	this.route('postEdit', {
		path: 'posts/:_id/edit',
		waitOn: function() {
			return Meteor.subscribe('singlePost', this.params._id);
		},
		data: function () {
			return Posts.findOne(this.params._id);
		}
	});

	this.route('postSubmit', {
		path: '/submit',
		disableProgress: true //disable iron-router-progress bar for this route.
	});
});