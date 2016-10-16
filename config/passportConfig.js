
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports.connect = function(passport,dbConnection) {

    // =========================================================================
    // passport session setup ==================================================
    // ===========a==============================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.account_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        dbConnection.query("SELECT account_id, student_id, professor_id, username FROM account WHERE account_id = ? ",[id], function(err, rows){
            done(err, rows[0]);   
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //console.log(req.body);
            dbConnection.query("SELECT * FROM account WHERE username = ?",[username], function(err, rows) {
                if (err){
                    console.log(err);
                    return done(err);
                }
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    //if there is no user with that username

                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO account (username, password,student_id) values (?,?,?)";
                    dbConnection.query("INSERT INTO student (student_first_name,student_last_name) values (?,?)",[req.body.firstName,req.body.lastName],function(err,data){
                        if(err){
                            return done(err);
                        }
                        dbConnection.query(insertQuery,[newUserMysql.username, newUserMysql.password,data.insertId],function(err, rows) {
                            if(err){
                                return done(err);
                            }
                            console.log(rows);
                            newUserMysql.user_id = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    })

                    
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            dbConnection.query("SELECT * FROM account WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
