PostHelpers = {
	ownPost: function () {
		return this.userId == Meteor.userId();
	},

	link: function () {
		if (this.url) return this.url;
		return Router.routes.postPage.path({id: this._id});
	},

	domain: function() {
		if (this.url) {
			var a = document.createElement('a'); a.href = this.url;
			return a.hostname;
		}
		
		return '(self)';
	},

	canEdit: function () {
		return PostHelpers.ownPost.call(this) && !this.url;
	}
};
