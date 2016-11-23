//Import DB connection from .chetscrub/config/mysqlConnection.js
var dbConnection = require("./config/mysqlConnection");
//Import request routes from ./config/routes.js
var routes = require("./config/routes");
var contentRoutes = require("./config/contentRoutes")

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var multer  = require('multer')
var storage = multer.diskStorage(
    {
        destination: './files/class_content',
        filename: function ( req, file, cb ) {
            //req.body is empty... here is where req.body.new_file_name doesn't exists
            cb( null, file.originalname );
        }
    }
);

var upload = multer({ storage: storage })

var fs = require('fs');
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
routes.connect(app,dbConnection,passport,io);
contentRoutes.connect(app,dbConnection,passport,io,upload,fs);

http.listen(3000);