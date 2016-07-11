'use strict';

var path = process.cwd();
var bodyParser = require('body-parser');
var PollsHandler = require(path + '/app/controllers/pollsHandler.server.js');

var jsonParser = bodyParser.json();
var pollsHandler = new PollsHandler();
require('dotenv').load();

module.exports = function (app, passport) {
	function isLoggedIn(req, res, next){
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/auth/twitter');
		}
	}
	
	app.route('/')
		.get(function(req, res, next) {
			res.redirect('/polls');
		});
		
	app.route('/polls')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/p/*')
		.get(function(req, res) {
	    	res.sendFile(path + "/public/poll_detail.html");
	});
	
	app.route('/my_polls')
		.get(isLoggedIn, function(req, res) {
		    res.sendFile(path + "/public/my_polls.html");
		});
	
	app.route('/new_poll')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/new_poll.html');
		});
		
	app.route('/logout')
		.get(isLoggedIn, function(req, res){
			req.session.destroy(function (err) {
				if (err) throw err;
		    	res.redirect('/'); //Inside a callback… bulletproof!
		  });
	});

	app.route('/api/all_polls')
		.get(pollsHandler.loadAll);
		
	app.route('/api/single_poll/*')
		.get(pollsHandler.loadSingle);
		
	app.route('/api/my_polls')
		.get(pollsHandler.loadUserPolls);
		
	app.route('/api/new_poll')
		.post(jsonParser, pollsHandler.createNewPoll);
		
	app.route('/api/vote/*')
		.get(pollsHandler.voteForPoll);	
	
	app.route('/api/add_option/*')
		.get(pollsHandler.addPollOption);
	
	app.route('/api/delete_poll/*')
		.get(pollsHandler.deletePoll);
		
	app.route('/api/:id')
		.get(function(req, res){
			res.json(req.session);
		});
	//-----------------------------------------------
	// Redirect the user to Twitter for authentication.  When complete, Twitter
	// will redirect the user back to the application at
	//   /auth/twitter/callback
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	// Twitter will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	app.get('/auth/twitter/callback',
	  passport.authenticate('twitter', { successRedirect: '/polls', //TEMPORARY
	                                     failureRedirect: '/polls' }));
};
