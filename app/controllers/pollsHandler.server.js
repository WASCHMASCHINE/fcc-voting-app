'use strict';
var mongo = require('mongodb').MongoClient;

function PollsHandler() {
    this.loadAll = function(req, res){
        mongo.connect(process.env.MONGO_URI, function(err, db) {
		if (err) throw err;
		var col = db.collection('polls');
		col.find().toArray(function(err, items) {
				if (err) throw err;
				res.json(items);
             });
	    });
    };
    
    this.loadUserPolls = function(req, res){
    	
    	var userId = req.session.passport.user.userId; 
    	console.log("inside load user polls", userId);
    	mongo.connect(process.env.MONGO_URI, function(err, db) {
			if (err) throw err;
			db.collection('polls-user').find({"userId": userId}).toArray(function(err, items) {
				if (err) throw err;
				if (items){
					var myPolls = items[0].votedPolls;
					console.log("items", items[0].votedPolls);
					db.collection('polls').find({'url': {$in: myPolls}}).toArray(function(err, items){
						if (err) throw err;
						console.log("looking for user polls", items);
						res.json(items);
					});
				} else {
					console.log("no items");
					res.json([]);
				}
             });
		});	
    };
    
    this.loadSingle = function(req, res){
    	// in production:	validate input?
    	var pollUrl = req.params[0];
    	mongo.connect(process.env.MONGO_URI, function(err, db) {
		if (err) throw err;
		var col = db.collection('polls');
		col.find({"url" : pollUrl}).toArray(function(err, item) {
				if (err) throw err;
				res.json(item);
             });
	    });
    };
    
    this.createNewPoll = function(req, res){
    	// in production:	vote count ~should~ be set to 0 or just now added
    	//					validation of input data
    	var randomUrl = Math.random().toString(36).substr(2, 6);
    	
    	var newEntry = req.body; 
    	newEntry.url = randomUrl;
    	newEntry.author = req.session.passport.user.userId; 
    	
		mongo.connect(process.env.MONGO_URI, function(err, db) {
			if (err) throw err;
			var pollCol = db.collection('polls');
			var userCol = db.collection('polls-user');
			pollCol.insert(newEntry, function(err,data){
				if (err) throw err;
			//	db.close();
				res.send(""+randomUrl);
			});
            userCol.update(
				{"userId": newEntry.author},
				{ $push: {"ownedPolls" : randomUrl}}, function(err,data){
			});
	    });
    };
    
    this.voteForPoll = function(req, res){
    	var pollUrl = req.params[0];
    	var answer = req.query['answer'];
    	
    	if (req.session.passport){ // logged in
    		var userId = req.session.passport.user.userId; 
    		mongo.connect(process.env.MONGO_URI, function(err, db) {
				if (err) throw err;
				
				db.collection('polls-user').find(
					{"userId": userId, 'votedPolls': pollUrl}).toArray(function(err,data){
						if (err) throw err;
						if (data[0]){ // already voted
							console.log("already voted");
						} else { // not yet voted
							db.collection('polls').update( 
								{"url": pollUrl, "options.description": answer}, 
								{$inc: {"options.$.count": 1}}, false, true);
							
							db.collection('polls-user').update(
								{"userId": userId},
								{ $push: {"votedPolls" : pollUrl}}, function(err,data){
									if (err) throw err;
							});
						}
					}
				);
			});	
    	} else { // not logged in
    		var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    		console.log(ip);
			mongo.connect(process.env.MONGO_URI, function(err, db) {
				if (err) throw err;
				
				db.collection('polls').find(
					{ $and:[{"url": pollUrl}, {'votedGuestIps': ip}]}).toArray(function(err,data){
						if (err) throw err;
						console.log("our data", data);
						if (data[0]){ // already voted
							console.log("already voted");
						} else { // not yet voted
							console.log("fresh vote", answer);
							
							db.collection('polls').update(
								{"url": pollUrl, "options.description": answer}, 
								{$inc: {"options.$.count": 1}}, false, true);
							db.collection('polls').update(
								{"url": pollUrl},
								{ $push: {"votedGuestIps" : ip}}, function(err,data){
									if (err) throw err;
							});
						}
					}
				);
			});	
    	}
    	
    	res.redirect("/p/"+pollUrl);
    };
    
    this.addPollOption = function(req, res){
    	var pollUrl = req.params[0];
    	var newOption = req.query['newOption'];
    	if (req.session.passport){ // logged in
    		mongo.connect(process.env.MONGO_URI, function(err, db) {
				if (err) throw err;
				var newEntryInOptions = {"count": 0, "description": newOption};
				db.collection('polls').update(
					{"url": pollUrl},
					{ $push: {"options" : newEntryInOptions}});
    		});
    		res.send("OK");
    	} else {
    		res.send("FAILURE");
    	}
    };
    
    this.deletePoll = function(req, res){
    	var pollUrl = req.params[0];
    	var userId = req.session.passport.user.userId;
    	mongo.connect(process.env.MONGO_URI, function(err, db) {
			if (err) throw err;
			
			db.collection('polls').remove(
				{"url": pollUrl}
			);
			
			db.collection('polls-user').update(
				{"userId": userId},
				{$pull: {'ownedPolls': pollUrl}}
			);
			
			// remove all votes
			db.collection('polls-user').update(
				{'votedPolls': pollUrl},
				{$pull: {'votedPolls': pollUrl}}
			);
		});
		res.redirect("/../../my_polls");
    };
}

module.exports = PollsHandler;