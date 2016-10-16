//Import DB connection from .chetscrub/config/mysqlConnection.js
var dbConnection = require("./config/mysqlConnection");
//Import request routes from ./config/routes.js
var routes = require("./config/routes");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var session  = require('express-session');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');

var passport = require('passport');
var passportConfig = require("./config/passportConfig");
passportConfig.connect(passport,dbConnection);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("client"));


app.use(session({
  secret: 'SuperMegaBentoSan',
  resave: true,
  saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Connect routes to server
routes.connect(app,dbConnection,passport);



app.listen(3000);