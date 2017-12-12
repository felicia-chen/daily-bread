const MongoClient = require('mongodb').MongoClient

var db;

module.exports = {
	connectToServer: function( callback ) {
		MongoClient.connect('mongodb://felchen:FELCHEN@ds029426.mlab.com:29426/felchen-cookbook', (err, database) => {
		  if (err) return console.log(err);
		  db = database;
		  return callback( err );
		})
	},

	getDb: function () {
		return db;
	}

}
