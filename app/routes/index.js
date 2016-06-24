'use strict';

var path = process.cwd();
var mongo = require('mongodb').MongoClient;//temp, should be in controller
var PollsLoader = require(path + '/app/controllers/pollsLoader.server.js');
var pollsLoader = new PollsLoader();

require('dotenv').load();

module.exports = function (app) {

	app.route('/polls')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/new_poll')
		.get(function(req, res) {
			res.sendFile(path + '/public/new_poll.html');
			/*var dummyPoll = {
				author: "dummy",
				question: "What is your favorite color?",
				options: [{count: 5, description: "Red"},
						{count: 12, description: "Blue"}]
			};
		
			mongo.connect(process.env.MONGO_URI, function(err, db) {
				if (err) throw err;
				var col = db.collection('polls');
				col.insert(dummyPoll, function(err,data){
					if (err) throw err;
					db.close();
				});
			});
		    res.redirect('/polls');*/
		});
	
	app.route('/api/all_polls')
		.get(pollsLoader.loadAll);
	
	app.route('/')
		.get(function(req, res, next) {
			res.redirect('/polls');
		});
};
