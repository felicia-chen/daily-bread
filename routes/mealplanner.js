var db; 
var initconnection = require('./init-connection.js');
initconnection.connectToServer( function( err ) {
	db = initconnection.getDb();
})
var functions = require('./functions.js');

const express = require('express');
var mealplanner = express.Router();
var mealItem = require('../models/mealitem.js');
//view meal planner-----------------------------------------------------------------------------------
mealplanner.get('/calendar', (req, res) => {
  	functions.getContents(req.session.username, function () {
  		functions.getMeals(req.session.username, function() {
  			var allMeals = functions.getMealList();
  			var allRecipes = functions.getRecipes();
    		res.render('calendar.ejs', {username: req.session.username,  recipes: allRecipes, meals: allMeals});
  		})
  	})
})

//add to meal planner 
mealplanner.post('/mealplanner', (req, res) => {
	var id = req.body.id;
	if (req.body.category == 'Snacks') {
		var meal = new mealItem({
			username: req.session.username,
			id: id,
			recipe: req.body.recipe,
			day: req.body.day,
			category: req.body.category
		});
		db.collection('mealplanner').save(meal, function (err) {
			if (err) return console.log(err)
			console.log('saved to database')
		})
	} else {
		db.collection('mealplanner').findOne({
			day: req.body.day,
			username: req.session.username,
			category: req.body.category
		}, (err, results) => {
			if (!results) {
				var meal = new mealItem({
					username: req.session.username,
					id: id,
					recipe: req.body.recipe,
					day: req.body.day,
					category: req.body.category
				});
			  	db.collection('mealplanner').save(meal, function (err) {
			    	if (err) return console.log(err)
			    	console.log('saved to database')
			  	})
			} else {
				console.log("reached update");
				db.collection('mealplanner').update({ 
					day: req.body.day,
					username: req.session.username,
					category: req.body.category
					},
			  		{ $set:
			    		{
						id: id,
						recipe: req.body.recipe,
			      		}
			   		}
				)
			}
		})
	}
})

//delete specific meal
mealplanner.post('/deletemeal/:day/:category', (req, res) => {
	var key = Object.keys(req.body);
	var recipe = key[0];
	db.collection('mealplanner').remove({
		username: req.session.username,
		day: req.params.day,
		category: req.params.category,
		recipe: recipe
	})
	res.send('removed');
})

//clear the planner
mealplanner.post('/clearmeals', (req, res) => {
	db.collection('mealplanner').remove({
		username: req.session.username
	});
	res.send('removed');
})


module.exports = mealplanner;