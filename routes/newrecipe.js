var db; 
var ObjectId = require('mongodb').ObjectID;
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/uploads')
  },
  filename: function(req, file, cb) {
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: storage});
var initconnection = require('./init-connection.js');
initconnection.connectToServer( function( err ) {
	db = initconnection.getDb();
})
var functions = require('./functions.js');

const express = require('express');
var newrecipe = express.Router();
var Recipe = require('../models/recipe.js');

//add a new recipe-------------------------------------------------------------------------------------
newrecipe.post('/recipe', upload.array('pic', 10), (req, res, next) => {
	var files = []
	for (var i = 0; i < req.files.length; i++){
		files[i] = req.files[i].filename;
	}
	var ingredients = req.body.ingredient.split(/\r|\n/);
	var steps = req.body.step.split(/\r|\n/);
	var finalingredients = [];
	var ct = 0;
	for (var i = 0; i < ingredients.length; i++) {
		if (ingredients[i] == '') {
			continue;
		} else {
			finalingredients[ct] = ingredients[i];
			ct++;
		}
	}
	var stepCount=[];
	var finalsteps = [];
	var ct2 = 0;
	for (var i = 0; i < steps.length; i++) {
		if (steps[i] == '') {
			continue;
		} else {
			finalsteps[ct2] = steps[i];
			ct2++;
		}
	}
	for (var i = 0; i < finalsteps.length; i++) {
			stepCount[i] = i + 1;
	}
	var newRecipe = new Recipe({
		username: req.session.username,
		recipe: req.body.recipe,
		Category: req.body.Category,
		servingsize: req.body.servingsize,
		ingredient: finalingredients,
		step: finalsteps,
		stepCount: stepCount,
		preptime: req.body.preptime,
		cooktime: req.body.cooktime,
		picture: files,
		description: req.body.description,
		notes: req.body.notes,
		rating: "0"
	})
  		db.collection('recipes').save(newRecipe, function (err) {
    	if (err) return console.log(err)
    	console.log('saved to database')
    	recipeAndID = newRecipe._id
    	next()
  		})
}, (req, res) => {
	res.redirect('/recipe/'  + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})


//click on recipe in navigation bar------------------------------------------------------------------------------------
newrecipe.get('/recipe/:recipe/:id/:username/', (req, res) => {
	var id = req.params.id
	// allRecipes = [];
	db.collection('recipes').findOne({
		_id: ObjectId(id),
		username: req.params.username
		// _id: id
	}, (err, results) => {
		if (err) return console.log(err)
		functions.getContents(req.params.username, function() {
			var allRecipes = functions.getRecipes();
			res.render('recipeview.ejs', {
			 recipes: allRecipes, recipeContents: results, username: req.params.username
			})
		})
	})
})


//rate the recipe--------------------------------------------------------------------------------------------------------
newrecipe.post('/rate/:id/', (req, res) => {
	var key = Object.keys(req.body);
	var rate = key[0];
	var id = req.params.id;
	db.collection('recipes').update(
	   	{ _id: ObjectId(id) },
	  	{ $set:
	    	{
	      	 	rating: rate
	      	}
	   	}
	)
})



module.exports = newrecipe;