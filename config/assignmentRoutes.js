var getStudentAssignment  = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, s.student_id, s.show_assignment,a.date,a.file_name "+
"FROM assignment a INNER JOIN assignment_ref_student s ON a.assignment_id  = s.assignment_id "+
"INNER JOIN class c ON c.class_id = a.class_id WHERE student_id = ? AND s.show_assignment = 1;";

var getProfessorAssignment = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, a.date,a.file_name "+
"FROM assignment a INNER JOIN class c ON c.class_id = a.class_id WHERE professor_id = ?;";

var afterInsert = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, a.date, a.file_name "+
"FROM assignment a INNER JOIN class c ON c.class_id = a.class_id WHERE assignment_id = ?;"

var getStudentGrade = "SELECT a.*, s.*,c.*,st.* FROM assignment_ref_student s INNER JOIN assignment a ON a.assignment_id = s.assignment_id INNER JOIN class c on a.class_id = c.class_id INNER JOIN student st ON st.student_id = s.student_id WHERE s.show_assignment = 0 AND s.student_id = ?;"

var getProfessorGrade = "SELECT a.*, s.*,c.*,st.* FROM assignment_ref_student s INNER JOIN assignment a ON a.assignment_id = s.assignment_id INNER JOIN class c on a.class_id = c.class_id INNER JOIN student st ON st.student_id = s.student_id WHERE s.show_assignment = 0 AND a.class_id = ?;"

module.exports.connect = function(app,con,passport,io,upload,fs,studentUpload){

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

    
    con.query(getProfessorAssignment,[req.params.id],function(err,data){
      if(err){
        res.json({error: "Failed to get assignment"})
      }
      else{
        res.json(data);
      }
    })
  })

  app.get("/downloadAssignment/:id",function(req,res){
    con.query("SELECT file_location FROM assignment WHERE assignment_id = ?",[req.params.id],function(err,data){
      if(err){
        res.json({error:"Error downloading file"})
      }
      else{
        var file =  data[0].file_location;
        
        res.download(file); // Set disposition and send it.
      }
    })
  })

  app.get("/downloadStudentFile/:id",function(req,res){
    con.query("SELECT student_file_location FROM assignment_ref_student WHERE assignment_ref_student_id = ?",[req.params.id],function(err,data){
      if(err){
        throw err;
        res.json({error:"Error downloading file"})
      }
      else{
        var file =  data[0].student_file_location;
        res.download(file); // Set disposition and send it.
      }
    })
  })

  app.post("/uploadAssignment",upload.single('file'),function(req,res){
    var postData = req.body;
    var d = new Date();
    postData.date = d.getTime();

    var fileLocation = null;
    var fileName = null;
    
    

    if(req.file){
      postData.fileLocation = './files/assignment/'+req.file.originalname;
      postData.fileName = req.file.originalname;
    }
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
              con.query("INSERT INTO assignment_ref_student (assignment_id, student_id,show_assignment,full_grade) VALUES (?,?,1,?)",[data.insertId, student.student_id, postData.full_grade]
                ,function(err){
                if(err){
                  res.json({error: "Failed to add assignment"});
                }
              })
          
              if(parseInt(studentData.length)-1 === i ){

                

              }
            })

            con.query(afterInsert,[data.insertId],function(err,result){
              if(err){
                res.json({error: "Failed to add assignment"});
              }
              else{
                
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



  app.post("/submitAssignment",studentUpload.single('file'),function(req,res){
    
    var returnData = req.body;


    if(req.file){
      returnData.fileLocation = './files/studentAssignments/'+req.file.originalname;
      returnData.fileName = req.file.originalname;
    }

    con.query("UPDATE assignment_ref_student SET student_comment = ?, show_assignment = 0, student_file_location = ?  WHERE assignment_id = ? AND student_id = ?",
      [returnData.comment, returnData.fileLocation, parseInt(returnData.assignmentID), req.user.student_id],function(err){
        if(err){
          throw err
          res.end();
        }
        else{
          con.query("SELECT a.*, s.*,c.*,st.* FROM assignment_ref_student s INNER JOIN assignment a ON a.assignment_id = s.assignment_id INNER JOIN class c on a.class_id = c.class_id INNER JOIN student st ON st.student_id = s.student_id WHERE s.assignment_id = ? AND s.student_id = ?;",
            [parseInt(returnData.assignmentID), req.user.student_id],function(err,data){
                if(err){
                  throw err;
                  res.end();
                }
                else{
                  io.emit("studentSubmit",data[0])
                  res.json(data[0]);
                }
            })
        }
      })

  })


  app.get("/studentGrade",function(req,res){
    con.query(getStudentGrade,[req.user.student_id],function(err,data){
      if(err){
        throw err;
        res.end();
      }
      else{
        res.json(data);
      }
    })
  })


  app.post("/ProfessorGrade",function(req,res){
    var metaData = [];
    req.body.forEach(function(out,i){
      con.query(getProfessorGrade,[out.class_id],function(err,data){
        if(err){
          throw err;
          res.end();
        }
        else{
          
          metaData[i] = data
          if(i == req.body.length-1){
            
            res.json(metaData);
          }
        }
      })
      
    })

    
  })


  app.post("/submitGrade",function(req,res){
    console.log(req.body)
    var newGradeData = req.body.newGrade;
    con.query("UPDATE assignment_ref_student SET professor_comment = ?, grade = ? WHERE assignment_ref_student_id = ?"
      ,[newGradeData.professor_comment, newGradeData.grade, newGradeData.assignment_ref_student_id],function(err){
        if(err){
          res.end();
        }
        else{
          io.emit("submitGrade",req.body);
          res.end();
        }
      })
  })
}

