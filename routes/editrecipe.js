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
var editrecipe = express.Router();


//edits---------------------------------------------------------------------------------------------------------------
editrecipe.post('/editTop', (req, res) => {
	res.render('editTop.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/editIngredients', (req, res) => {
	res.render('editIngredients.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/editDirections', (req, res) => {
	res.render('editDirections.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/editNotes', (req, res) => {
	res.render('editNotes.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/editGallery', (req, res) => {
	res.render('editGallery.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/recipeview', (req, res) => {
	res.render('recipeview.ejs', {recipeContents: req.body, username: req.session.username})
})
editrecipe.post('/editGallery/:Category/:id/:username/', upload.array('pic', 10), (req, res, next) => {
	var files = []
	for (var i = 0; i < req.files.length; i++){
		files[i] = req.files[i].filename;
	}
	var id = req.params.id;
	recipeAndID = id;
	db.collection('recipes').update(
	   		{ _id: ObjectId(id) },
	  		{ $set:
	    		{
	       	 		picture: files
	      		}
	   		}
		)
		next()
	}, (req, res) => {
		res.redirect('/recipe/' + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})

var Promise = require('promise');
//update submissions-------------------------------------------------------------------------------------------------------
editrecipe.post('/update/:Category/:id/:username/:which/',  (req, res, next) => {
	update(req, function() {
		next();
	})
}, (req, res) => {
	res.redirect('/recipe/' + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})


//Delete a recipe-----------------------------------------------------------------------------------------
editrecipe.post('/delete/', (req, res) => {
	var user = req.session.username;
	var id = req.body._id;
	db.collection('recipes').remove({
		_id: ObjectId(id),
		username: user
	})
	res.send(req.body.recipe);
})

editrecipe.get('/deleted/', (req, res) => {
	functions.getContents(req.session.username, function () {
		var allRecipes = functions.getRecipes();
    	res.render('deleted.ejs', {username: req.session.username,  recipes: allRecipes});
  	})
})


function update(req, callback) {
	var id = req.params.id;
	recipeAndID = id;
	var which = req.params.which;
	if (which == "editTop") {
		var comp = functions.getTop(req);
		db.collection('recipes').update(
	   		{ _id: ObjectId(id) },
			{ $set:
			  	{
			       	recipe: comp[0],
			        servingsize: comp[1],
			       	cooktime: comp[2],
			       	preptime: comp[3],
			       	description: comp[4]
			    }
			}
		)
	} else if (which == "editIngredients") {
		var ingredients = [];
		if (typeof req.body.ingredient === "string") {
			ingredients.push(req.body.ingredient);
		} else {
			ingredients = req.body.ingredient;
		}
		db.collection('recipes').update(
			{ _id: ObjectId(id) },
		 	{ $set:
			    {
			       	ingredient: ingredients
			    }
			}
		)
	} else if (which == "editDirections") {
		var comp = [];
		comp = getDirections(req);
		db.collection('recipes').update(
			{ _id: ObjectId(id) },
			{ $set:
			    {
			       	step: comp[0],
			       	stepCount: comp[1]
			    }
			}
		)
	} else if (which == "editNotes") {
		db.collection('recipes').update(
			{ _id: ObjectId(id) },
			{ $set:
			    {
			       notes: req.body.notes
			    }
			}
		)
	}
	callback();
}



module.exports = editrecipe;