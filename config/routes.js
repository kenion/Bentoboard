var socket;


module.exports.connect = function(app,dbConnection,passport,io){

io.on("connection",function(socketConnection){
      socket = socketConnection;   
})

  app.get("/",function(req,res){
    res.send("hello");
  })


  app.get("/profile",function(req,res){
    res.send("hello");
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/fail', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
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


  app.get("/student/class",function(req,res){

    if(req.user === undefined){
      res.redirect("/");
    }
    dbConnection.query("SELECT s.student_first_name, s.student_last_name, c.name, c.subject,c.style, c.number,c.class_id "+
      "FROM student s "+
      "INNER JOIN Ref_class_student r on r.student_id = s.student_id "+
      "INNER JOIN class c on r.class_id = c.class_id "+
      "WHERE s.student_id = ?",[req.user.student_id]
      ,function(err,data){
        if(err){
          res.redirect("/");
        }
        else{
          res.json(data);
        }
      })
  })

  app.get("/professor/class",function(req,res){
    if(req.user === undefined){
      res.redirect("/");
    }
    dbConnection.query("SELECT p.professor_first_name, p.professor_last_name, c.name, c.style, c.subject, c.number,c.class_id "+
      "FROM professor p "+
      "INNER JOIN Ref_class_professor r on r.professor_id = p.professor_id "+
      "INNER JOIN class c on r.class_id = c.class_id "+
      "WHERE p.professor_id = ?",[req.user.professor_id]
      ,function(err,data){
        if(err){
          res.redirect("/");
        }
        else{
          res.json(data);
        }
      })
  })

  app.post("/send/announcement",function(req,res){
    dbConnection.query("INSERT into announcements (subject,body,class_id,date) values (?,?,?,?)",
      [req.body.subject,req.body.body,req.body.class_id, req.body.date],function(err){
        if(err){
          throw err;
          res.end();
        }
        else{
          io.emit("1",req.body);
          res.end();
        }
      })
  });

  app.post("/delete/announcement",function(req,res){
    var banish = req.body;
    console.log(banish);
    dbConnection.query("DELETE FROM announcements WHERE  class_id = ? AND body = ? AND date = ? AND subject = ?"
      ,[banish.class_id, banish.body, banish.date, banish.subject]
      ,function(err){
        if(err){
          throw err;
          res.end();
        }
        else{
          io.emit("2",banish);
          res.end();
        }
      })
  })

  app.get('/logout', function(req, res) {
    req.logout();

    res.status(200).json({
        status: 'Bye!'
      });
  });

  app.get("/get/announcements",function(req,res){
    dbConnection.query("SELECT c.class_id, c.name, a.subject, a.body, a.date FROM announcements a INNER JOIN class c on c.class_id = a.class_id",function(err,data){
      if(err){
        throw err;
        res.end();
      }
      else{
        res.json(data);
      }
    });
  })


}

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
}
