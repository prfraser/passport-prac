// ExpressJS Module
var express = require('express'),
    express_session = require('express-session'),
    bodyParser = require('body-parser'),
    app = express();

var passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;

var Mongoose = require('mongoose'),
		Mconnection = Mongoose.createConnection("mongodb://localhost/users");

Mongoose.createConnection("mongodb://localhost/users", function(err){
	if (err) { 
		console.log(err);
	} else {
		console.log('Connected to mongoose');
	}
});

var SchemaUser = new Mongoose.Schema({
	username: String,
	password: String,
	email: String
});

var User = Mconnection.model('users', SchemaUser);

// Tokenization
passport.serializeUser(function(user, done) {
	done(null, user._id)
});

// Deserialization
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express Session
app.use(express_session({
	secret: "12345",
	save: false,
	saveUninitialize: false,
	cookie: {
		secure: false
	}
}));

passport.use('local-login', new LocalStrategy(function(username, password, done) {
	// Algo to verify if username exists and password matches and sanatizes input.

}));

app.use(passport.initialize());
app.use(passport.session());

// ExpressJS Static
app.use(express.static(__dirname + '/public'));

// ExpressJS Rendering Engine
app.set('view engine', 'pug');

// Authentication Page
app.get('/auth', function (req, res) {
  res.render('auth');
});

app.post('/auth', passport.authenticate('local-login', { failureRedirect: '/auth '}), function(req, res) {
	res.redirect('/dashboard');
})

// Port Listening
var server = app.listen('3000', '127.0.0.1', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("ExpressJS Server working at -> http://%s:%s", host, port);
});