Package.describe({
	summary: "A pattern to display application errors to the user"
});

Package.on_use(function (api, where) {
	api.use(['minimongo', 'mongo-livedata', 'templating'], 'client'); 
	api.add_files(['errors.js', 'errors.list.html', 'errors.list.js'], 'client');
	if (api.export)
		api.export('Errors');
});

Package.on_test(function(api) {
	api.use('errors', 'client'); 
	api.use(['tinytest', 'test-helpers'], 'client');
	api.add_files('errors.tests.js', 'client'); 
});