var getStudentAssignment  = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name, s.student_id, s.show "+
"FROM assignment a INNER JOIN assignment_ref_student s ON a.assignment_id  = s.assignment_id "+
"INNER JOIN class c ON c.class_id = a.class_id WHERE student_id = ?;";

var getTeacherAssignment = "SELECT a.assignment_id, a.assignment_name, a.class_id, a.body,a.file_location, c.name"+
"FROM assignment a INNER JOIN class c ON c.class_id = a.class_id WHERE professor_id = ?;";

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

    con.query(getProfessorAssignment,[req.params.id],function(err,data){
      if(err){
        res.json({error: "Failed to get assignment"})
      }
      else{
        res.json(data);
      }
    })
  })

  app.post("/addAssignment",function(req,res){
    var postData = req.body;
    console.log(postData);
    con.query("INSERT INTO assignment (assignment_name, class_id, body, file_location, professor_id) VALUES (?,?,?,?,?)"
      ,[postData.assignment_name, postData.class_id, postData.body, null, postData.professor_id],function(err,data){
      if(err){
        res.json({error: "Failed to add assignment"})
      }
      else{
        con.query("SELECT student_id FROM Ref_class_student WHERE class_id = ?",[postData.class_id],function(err,studentData){
          if(err){
            res.json({error: "Failed to add assignment"});
          }else{
            studentData.forEach(function(student){
              con.query("INSERT INTO assignment_ref_student (assignment_id, student_id,show) VALUES (?,?,1)",[data.insertId, student.student_id]
                ,function(err){
                if(err){
                  res.json({error: "Failed to add assignment"});
                }
              })
            })
          }
        })
      }
    })
    res.end();
  })




  app.delete("/deleteAssignment/:id",function(req,res){
    con.query("DELETE FROM assignment WHERE assignment_id = ?",[req.params.id],function(err){
      if(err){
        res.json({error: "Failed to delete assignment"});
      }
      else{
        con.query("DELETE FROM assignment_ref_student WHERE assignment_id = ?",[req.params.id],function(err){
          if(err){
            res.json({error: "Failed to delete assignment"});
          }
          else{
            res.end();
          }
        })
      }
    })
  })



}

