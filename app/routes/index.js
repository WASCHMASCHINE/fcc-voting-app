'use strict';

var path = process.cwd();

module.exports = function (app) {

	app.route('/polls')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/')
		.get(function(req, res, next) {
			res.redirect('/polls');
		});
};
