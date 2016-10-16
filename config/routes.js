module.exports.connect = function(app,dbConnection,passport){

  app.get("/",function(req,res){
    res.send("hello");
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/fail', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/fail', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get("/fail",function(req,res){
    res.send("fail");
  })

  app.get('/status',function(req,res){
    if(!req.isAuthenticated()){
      return res.json({
        status:false
      });
    }
    else{
      return res.json({
        status:true
      });
    }
  });

  app.get('/getUserData',function(req,res){
    res.json(req.user);
  })

}