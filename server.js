const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
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


//mongoose.connect('mongodb://felchen-cookbook:zaidoreiyu@ds259305.mlab.com:59305/cookbook-recipe-database');
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//define all databases
MongoClient.connect('mongodb://felchen-cookbook:zaidoreiyu@ds259305.mlab.com:59305/cookbook-recipe-database', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function() {
  console.log('listening on 3000');
	})
})


//logn requires
var cookieSession = require('cookie-session');
var User = require('./User');
app.use(cookieSession({
  secret: 'SHHisASecret'
}));




//login procsesses---------------------------

app.get('/', (req, res) => {
  res.render('home.ejs')
})


app.get('/loginform', (req, res) => {
	res.render('login.ejs');
})

app.get('/registerform', (req,res) => {
	res.render('register.ejs');
})

app.post('/login', function(req, res) {
  username = req.body.username;
  password = req.body.password;
  User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
    	var message = "User does not exist! Please try again.";
      res.render('errorlogin.ejs', {message: message});
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/enter');
      } else {
      	var message = "Incorrect password! Please try again.";
 		res.render('errorlogin.ejs', {message: message});
      }
    }
  });

});

app.post('/register', function(req, res) {
  User.addUser(req.body.username, req.body.password, function(err) {
    if (err) {
    	var message = "Username taken! Please try a different username."
    	res.render('errorlogin.ejs', {message: message});
    }
    else res.render('successregister.ejs');
  });
});

app.get('/logout', function(req, res) {
  req.session.username = '';
  res.render('home.ejs');
});


//recipe------------------------------------------------------------------
var Recipe = mongoose.model('Recipe', {
	username: {
		type: String,
		required: true
	},
	recipe: {
		type: String,
		required: true
	},
	Category: {
		type: String,
		required: true
	},
	servingsize: {
		type: String,
		required: true
	},
	ingredient: {
		type: Array,
		required: true
	},
	step: {
		type: Array,
		required: true
	},
	stepCount: {
		type: Array,
		required: true
	},
	preptime: {
		type: String,
		required: true
	},
	cooktime: {
		type: String,
		required: true
	},
	picture: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	}
})

var db;
var cookies = [''];
var pies = [''];
var breads = [''];
var cakes  =[''];
var allRecipes = [];
var specificRecipe = [];
var recipeAndID = [];

//once the user enters something into the form, this event is triggered
//saved into the mongdob mlab database into correct respective folder
//CREATE RECIPE------------------------------------------------------------------
app.post('/recipe', upload.single('pic'), (req, res, next) => {
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

	var newRecipe = new Recipe({
		username: req.session.username,
		recipe: req.body.recipe,
		Category: req.body.Category,
		servingsize: req.body.servingsize,
		ingredient: req.body.ingredient,
		step: finalsteps,
		stepCount: stepCount,
		preptime: req.body.preptime,
		cooktime: req.body.cooktime,
		picture: req.file.filename,
		description: req.body.description
	})
  		db.collection(req.body.Category).save(newRecipe, function (err) {
    	if (err) return console.log(err)
    	console.log('saved to database')
    	recipeAndID = newRecipe._id
    	next()
  	})
}, (req, res) => {
	res.redirect('/recipe/' + req.body.Category + '/' + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})


//clicks on recipe, fetches recipe info from database, then call next
//to render the recipe on recipeview
//CLICK ON TABLE OF CONTENTS-------------------------------------------------
app.get('/recipe/:Category/:recipe/:id/:username/', (req, res) => {
	var id = req.params.id
	allRecipes = [];
	db.collection(req.params.Category).findOne({
		_id: ObjectId(id),
		username: req.params.username
		// _id: id
	}, (err, results) => {
		if (err) return console.log(err)
		getContents(function() {
			//console.log(allRecipes)
			// console.log(allRecipes[0].length)
			// console.log(allRecipes[0])
			res.render('recipeview.ejs', {
			 recipes: allRecipes, recipeContents: results, username: req.params.username
			})
		})
	})
})


//UPDATE----------------------------------------------------------------------
//handle clicking the edit button

app.post('/editTop', (req, res) => {
	res.render('editTop.ejs', {recipeContents: req.body, username: req.session.username})
})
app.post('/editIngredients', (req, res) => {
	res.render('editIngredients.ejs', {recipeContents: req.body, username: req.session.username})
})

app.post('/editDirections', (req, res) => {
	res.render('editDirections.ejs', {recipeContents: req.body, username: req.session.username})
})

app.post('/editGallery', (req, res) => {
	res.render('editGallery.ejs', {recipeContents: req.body, username: req.session.username})
})


app.post('/recipeview', (req, res) => {
	res.render('recipeview.ejs', {recipeContents: req.body, username: req.session.username})
})

app.post('/editGallery/:Category/:id/:username/', upload.single('pic'), (req, res, next) => {
	console.log(req.body.recipe)
	var id = req.params.id;
	recipeAndID = id;
	db.collection(req.params.Category).update(
	   		{ _id: ObjectId(id) },
	  		{ $set:
	    		{
	       	 		picture: req.file.filename,
	      		}
	   		}
	)
	next()
	}, (req, res) => {
		res.redirect('/recipe/' + req.params.Category + '/' + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})

//updates 
app.post('/update/:Category/:id/:username/:which/',  (req, res, next) => {
	var id = req.params.id;
	recipeAndID = id;
	var which = req.params.which;
	if (which == "editTop") {
		var comp = getTop(req);
		db.collection(req.params.Category).update(
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
		db.collection(req.params.Category).update(
	   		{ _id: ObjectId(id) },
	  		{ $set:
	    		{
	       	 		ingredient: req.body.ingredient
	      		}
	   		}
		)
	} else if (which == "editDirections") {
		var comp = [];
		comp = getDirections(req);
		console.log(comp);
		db.collection(req.params.Category).update(
	   		{ _id: ObjectId(id) },
	  		{ $set:
	    		{
	       	 		step: comp[0],
	       	 		stepCount: comp[1]
	      		}
	   		}
		)
	}
	next()
}, (req, res) => {
	res.redirect('/recipe/' + req.params.Category + '/' + req.body.recipe + '/' + recipeAndID + '/' + req.session.username + '/')
})

//GENERATES CONTENTS---------------------------------------------------------------
//generates all contents
app.get('/enter', (req, res) => {
	console.log(req.session.username);
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
  	getContents(function () {
    	res.render('index.ejs', { username: req.session.username,  recipes: allRecipes});
  	})
  }  	
})

//get all the contents
function getContents(callback) {
	cookies = db.collection('Cookies').find().toArray(function(err, results) {
		cookies = results
		allRecipes.push(cookies);
		db.collection('Pies').find().toArray(function(err, results) {
			pies = results
		 	allRecipes.push(pies);
			db.collection('Breads').find().toArray(function(err, results) {
				breads = results
		  		allRecipes.push(breads);
				db.collection('Cakes').find().toArray(function(err, results) {
					cakes = results
			  		allRecipes.push(cakes);
					callback();
				})
			})
		})
	})
}


function getDirections(req) {
		// var finalsteps = []
		// //make array of numbered steps
		// var stepCount = [];
		var comp = [];
		var finalsteps = []
		//make array of numbered steps
		var stepCount = [];

		console.log(req.body.step);
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
		console.log(comp);
		return comp;
}

function getTop(req) {
	var comp = [];
	comp[0] = req.body.recipe;
	comp[1] = req.body.servingsize;
	comp[2] = req.body.cooktime;
	comp[3] = req.body.preptime;
	comp[4] = req.body.description
	return comp;
}