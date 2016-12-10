

module.exports.connect = function(app,con,passport,io,upload,fs){



  app.post("/uploadContent",upload.single('file'),function(req,res,next){
   
    var d = new Date();
    var date = d.getTime();

    var fileLocation = './files/class_content/'+req.file.originalname;

    con.query("INSERT INTO class_content (file_location, class_id,subject,body,date,file_name) VALUES (?,?,?,?,?,?)",
      [fileLocation, req.body.class_id, req.body.subject, req.body.body,date,req.file.originalname],
      function(err,data){
        if(err){
          throw err;
          res.json({error: "Failed to add file"});
        }
        else{
          con.query("SELECT con.class_content_id,con.file_location, con.class_id, con.subject, con.body, ca.name,con.date,con.file_name "+
            "FROM class_content con INNER JOIN class ca ON ca.class_id = con.class_id WHERE con.class_content_id = ?;",
            [data.insertId],function(err,data){
              if(err){
                throw err;
                res.json({error: "Failed to add file"});
              }
              else{
                io.emit("uploadContent",data[0]);
                res.json(data[0]);
              }

            })
          
        }
      })

  })

  app.get("/getContents",function(req,res){
    con.query("SELECT con.class_content_id,con.file_location, con.class_id, con.subject, con.body, ca.name,con.date,con.file_name "+
      "FROM class_content con INNER JOIN class ca ON ca.class_id = con.class_id;",function(err,data){
      if(err){
        throw err;
        res.json({error: "Error to gather data"});
      }
      else{
        res.json(data);
      }
    })

  })

  app.post("/deleteContent/",function(req,res){
    con.query("DELETE FROM class_content WHERE class_content_id = ?", [req.body.class_content_id],function(err,data){
      if(err){
        res.json({error: "Failed to delete content"});
      }
      else{
        fs.unlink(req.body.file_location,function(err){
          if(err){
            throw err;
            res.json({error: "Failed to delete content"});
          } 
          else{
            io.emit("deleteContent",req.body);
            res.json({error: null});
          } 
        })
        
      }
    })
  })

  app.get("/downloadFile/:id",function(req,res){
    con.query("SELECT file_location FROM class_content WHERE class_content_id = ?",[req.params.id],function(err,data){
      if(err){
        res.json({error:"Error downloading file"})
      }
      else{
        var file =  data[0].file_location;
        res.download(file); // Set disposition and send it.
      }
    })
  })
    
}