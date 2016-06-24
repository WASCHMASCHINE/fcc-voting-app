'use strict';

var mongo = require('mongodb').MongoClient;

function PollsLoader() {
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
}

module.exports = PollsLoader;