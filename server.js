const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var specificRecipe = [];
var recipeAndID = [];
var ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//connection
var db; 
var initconnection = require('./routes/init-connection.js');
initconnection.connectToServer( function( err ) {
	app.listen(3000, function() {
	  console.log('listening on 3000');
	})
	db = initconnection.getDb();
})


//logn requires
var cookieSession = require('cookie-session');
var User = require('./User');
app.use(cookieSession({
  secret: 'SHHisASecret'
}));

//functions
var functions = require('./routes/functions.js');


//login processes--------------------------------------------------------------------------------------
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
        res.redirect('/userprofile');
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


//landing page after login
app.get('/enter', (req, res) => {
	console.log(req.session.username);
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
  	functions.getContents(req.session.username, function () {
  		var allRecipes = functions.getRecipes();
    	res.render('index.ejs', {username: req.session.username,  recipes: allRecipes});
  	})
  }  	
})

//view user profile
app.get('/userprofile', (req, res) => {
  	functions.getContents(req.session.username, function () {
  		var allRecipes = functions.getRecipes();
    	res.render('profile.ejs', {username: req.session.username,  recipes: allRecipes});
  	})
})


//mealplanner
app.use(require('./routes/mealplanner.js'));

//new recipe
app.use(require('./routes/newrecipe.js'));

//edit recipes
app.use(require('./routes/editrecipe.js'));

//grocery list
app.use(require('./routes/grocerylist.js'));

