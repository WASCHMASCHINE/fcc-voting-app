'use strict';
var TwitterStrategy = require('passport-twitter').Strategy;
var mongo = require('mongodb').MongoClient;

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    
    passport.deserializeUser(function(id, done){
        mongo.connect(process.env.MONGO_URI, function(err, db) {
            if (err) { return done(err); }
            var col = db.collection('polls-user');
            col.find({'userId': id}).toArray(function(err, user){
                if (err){ return done(err); }
                return done(null, user);
            });
        });
    });
    
    passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.APP_URL + "auth/twitter/callback"
        },
        function(token, tokenSecret, profile, done){
            process.nextTick(function(){
                
                mongo.connect(process.env.MONGO_URI, function(err, db) {
                    if (err) { return done(err); }
                    var col = db.collection('polls-user');
                    col.findOne({'userId': profile.id}, function(err, result) {
        				if (err) { return done(err); }
        				
        				if (result){
        				    return done(null, result);    
        				} else {
        				    var newEntry = {'userId': profile.id, 'displayName': profile.displayName, 'ownedPolls': [], 'votedPolls': []};
                            col.insert(newEntry, function(err,data){
                    			if (err) throw err;
                    			db.close();
                    			done(null, newEntry);
                            });
        				}
                    });
    	        });
            });
            
        }
    ));
};