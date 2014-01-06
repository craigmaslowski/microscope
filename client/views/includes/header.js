Template.header.helpers({
	pageTitle: function() { 
		if (!Session.get('pageTitle'))
			Session.set('pageTitle', 'Microscope');
		return Session.get('pageTitle'); 
	},
	
 	activeRouteClass: function(/* route names */) {
 		var args = Array.prototype.slice.call(arguments, 0);
		args.pop();
    
		var active = _.any(args, function(name) {
 			return Router.current().route.name === name
 		});
 
		return active && 'active';
 	}
});