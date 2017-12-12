var db; 
var initconnection = require('./init-connection.js');
initconnection.connectToServer( function( err ) {
	db = initconnection.getDb();
})

var allRecipes = [];
var allMeals = [];
var groceries = [];
var methods = {
	getContents : function (user, callback) {
		allRecipes = [];
		db.collection('recipes').find({username: user}).toArray(function(err, results) {
			var breakfast = [''];
			var appetizer = [''];
			var soup = [''];
			var main = [''];
			var side = [''];
			var bread = [''];
			var drink = [''];
			var dessert = [''];
			var misc = [''];
			for (var i = 0; i < results.length; i++) {
				if (results[i].Category == "Breakfast") {
					breakfast.push(results[i]);
				} else if (results[i].Category == "Appetizer") {
					appetizer.push(results[i]);
				} else if (results[i].Category == "Soup") {
					soup.push(results[i]);
				} else if (results[i].Category == "Main") {
					main.push(results[i]);	
				} else if (results[i].Category == "Side") {
					side.push(results[i]);	
				} else if (results[i].Category == "Bread") {
					bread.push(results[i]);	
				} else if (results[i].Category == "Drink") {
					drink.push(results[i]);
				} else if (results[i].Category == "Dessert") {
					dessert.push(results[i]);	
				} else if (results[i].Category == "Misc") {
					misc.push(results[i]);	
				}
			}
			allRecipes.push(breakfast);
			allRecipes.push(appetizer);
			allRecipes.push(soup);
			allRecipes.push(main);
			allRecipes.push(side);
			allRecipes.push(bread);
			allRecipes.push(drink);
			allRecipes.push(dessert);
			allRecipes.push(misc);
			callback();
		})
	},
	getGroceryList: function (user, callback) {
		groceries = [];
		db.collection('grocerylist').find({username: user}).toArray(function(err, results) {
			for (var i = 0; i < results.length; i++) {
				groceries[i] = results[i].item
			}
			callback();
		})
	},

	getMeals: function (user, callback) {
		allMeals = [];
		db.collection('mealplanner').find({username: user}).toArray(function(err, results) {
			for (var i = 0; i < results.length; i++) {
				allMeals[i] = results[i]
			}
			callback();
		})	
	},

	getDirections: function (req) {
		var comp = [];
		var finalsteps = []
		//make array of numbered steps
		var stepCount = [];

		if (Array.isArray(req.body.step) == true) {
			var initialsteps = req.body.step
			var counter = 0;
			for (var i = 0; i <	initialsteps.length; i++) {
				if ((initialsteps[i] == "" || initialsteps[i] == '' || typeof initialsteps[i] == null || typeof initialsteps[i] == undefined)) {
					continue;
				} 
				finalsteps[counter] = initialsteps[i];
				counter++;
			}
			for (var i = 0; i < finalsteps.length; i++) {
				stepCount[i] = i + 1;
			}
		} else {
			finalsteps[0] = req.body.step
			stepCount[0] = 1;
		}	
		comp[0] = finalsteps;
		comp[1] = stepCount;
		return comp;
	},
	getTop: function (req) {
		var comp = [];
		comp[0] = req.body.recipe;
		comp[1] = req.body.servingsize;
		comp[2] = req.body.cooktime;
		comp[3] = req.body.preptime;
		comp[4] = req.body.description
		return comp;
	},
	getRecipes: function () {
		return allRecipes;
	},
	getMealList: function() {
		return allMeals;
	},
	getGroceries: function() {
		return groceries;
	}
}

module.exports = methods;