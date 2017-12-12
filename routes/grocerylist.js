var db; 
var ObjectId = require('mongodb').ObjectID;
var initconnection = require('./init-connection.js');
initconnection.connectToServer( function( err ) {
	db = initconnection.getDb();
})
var functions = require('./functions.js');
const express = require('express');
var grocerylist = express.Router();
var GroceryItem = require('../models/groceryitem.js');

//Grocery List------------------------------------------------------------------------------------------------
grocerylist.get('/grocerylist', (req, res) => {
	functions.getContents(req.session.username, function () {
		functions.getGroceryList(req.session.username, function() {
			var allRecipes = functions.getRecipes();
			var groceries = functions.getGroceries();
    		res.render('grocerylist.ejs', {username: req.session.username,  recipes: allRecipes, groceryList: groceries});
		})
  	})
})

grocerylist.post('/addgrocery', (req, res) => {
	var key = Object.keys(req.body);
	var Item = key[0];
	var newItem = new GroceryItem({
		username: req.session.username,
		item: Item
	})
  	db.collection('grocerylist').save(newItem, function (err) {
    	if (err) return console.log(err)
    	console.log('saved to database')
  	})
})

grocerylist.post('/cleargroceries',  (req, res) => {
	db.collection('grocerylist').remove({
		username: req.session.username
	});
	res.send('removed');
})

module.exports = grocerylist;