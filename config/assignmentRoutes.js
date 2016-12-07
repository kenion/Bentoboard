var getStudentAssignment  = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, s.student_id, s.show_assignment,a.date "+
"FROM assignment a INNER JOIN assignment_ref_student s ON a.assignment_id  = s.assignment_id "+
"INNER JOIN class c ON c.class_id = a.class_id WHERE student_id = ?;";

var getProfessorAssignment = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, a.date "+
"FROM assignment a INNER JOIN class c ON c.class_id = a.class_id WHERE professor_id = ?;";

var afterInsert = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, a.date "+
"FROM assignment a INNER JOIN class c ON c.class_id = a.class_id WHERE assignment_id = ?;"

module.exports.connect = function(app,con,passport,io,upload,fs){

  app.get("/getAssignment/student/:id",function(req,res){
    con.query(getStudentAssignment,[req.params.id],function(err,data){
      if(err){
        res.json({error: "Failed to get assignment"})
      }
      else{
        res.json(data);
      }
    })
  })

  app.get("/getAssignment/professor/:id",function(req,res){

    console.log(req.params.id)
    con.query(getProfessorAssignment,[req.params.id],function(err,data){
      if(err){
        res.json({error: "Failed to get assignment"})
      }
      else{
        res.json(data);
      }
    })
  })

  app.post("/uploadAssignment",upload.single('file'),function(req,res){
    var postData = req.body;
    var d = new Date();
    postData.date = d.getTime();

    var fileLocation = null;
    var fileName = null;
    
    console.log(postData)

    if(req.file){
      postData.fileLocation = './files/assignment/'+req.file.originalname;
      postData.fileName = req.file.originalname;
    }

    console.log(postData);
    con.query("INSERT INTO assignment (assignment_name, class_id, body, file_location, professor_id,file_name,date) VALUES (?,?,?,?,?,?,?)"
      ,[postData.assignment_name, postData.class_id, postData.body, postData.fileLocation, postData.professor_id,postData.fileName,postData.date],function(err,data){

      if(err){
        throw err;
        res.json({error: "Failed to add assignment"});
      }
      else{
        con.query("SELECT student_id FROM Ref_class_student WHERE class_id = ?",[postData.class_id],function(err,studentData){

          if(err){
 
            res.json({error: "Failed to add assignment"});
          }else{
            studentData.forEach(function(student,i){
              con.query("INSERT INTO assignment_ref_student (assignment_id, student_id,show_assignment) VALUES (?,?,1)",[data.insertId, student.student_id]
                ,function(err){
                if(err){
                  res.json({error: "Failed to add assignment"});
                }
              })
              console.log(studentData.length-1 );

              if(parseInt(studentData.length)-1 === i ){

                

              }
            })

            con.query(afterInsert,[data.insertId],function(err,result){
              if(err){
                res.json({error: "Failed to add assignment"});
              }
              else{
                console.log(result[0]);
                io.emit("uploadAssignment",result[0]);
                res.json(result[0]);
              }
            })

        
          }
        })
      }
    })
    
  })




  app.post("/deleteAssignment",function(req,res){
    var returnData = req.body;
    console.log(returnData)
    con.query("DELETE FROM assignment WHERE assignment_id = ?",[returnData.assignment_id],function(err){
      if(err){
        res.json({error: "Failed to delete assignment"});
      }
      else{
        con.query("DELETE FROM assignment_ref_student WHERE assignment_id = ?",[returnData.assignment_id],function(err){
          if(err){
            res.json({error: "Failed to delete assignment"});
          }
          else{
            io.emit("deleteAssignment",req.body);
            res.end();
          }
        })
      }
    })
  })


}

