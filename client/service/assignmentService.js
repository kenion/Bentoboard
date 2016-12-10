var app = angular.module("app");

var assignment = {};
app.service("assignmentService",["$http",'$window',function($http,$window){

  return({
    getStudentAssignment: getStudentAssignment,
    getProfessorAssignment: getProfessorAssignment,
    setAssignment: setAssignment,
    getAssignment: getAssignment,
    deleteAssignment: deleteAssignment,
    downloadFile : downloadFile,
    getStudentGrades: getStudentGrades,
    getProfessorGrades: getProfessorGrades,
    setGrade: setGrade,
    getGrade: getGrade,
    downloadStudentFile: downloadStudentFile,
    submitGrade: submitGrade  
  })

  function downloadFile(id){
    return $http.get("/downloadAssignment/"+id)
    .success(function(data, status, headers, config) {
        $window.open('/downloadAssignment/'+id); //does the download
      })
  }

  function submitGrade(gradeHolder){
    return $http.post("/submitGrade",gradeHolder)
    .success(function(data){
      return data;
    })
    .error(function(){

    })
  }


  function downloadStudentFile(id){
    return $http.get("/downloadStudentFile/"+id)
    .success(function(data, status, headers, config) {
        $window.open('/downloadStudentFile/'+id); //does the download
    })
  }
  function getStudentAssignment(id){
    return $http.get("/getAssignment/student/"+id)
    .success(function(data){
      return data;
    })
    .error(function(){
      return "error"
    })
  }  

  function deleteAssignment(data){
    return $http.post("/deleteAssignment",data)
    .success(function(){

    })
    .error(function(){

    })
  }

  function getProfessorAssignment(id){
    return $http.get("/getAssignment/professor/"+id)
    .success(function(data){
      return data;
    })
    .error(function(){
      return "error"
    })
  }  

  function setAssignment(assignment){
    this.assignment = assignment;
  }
  
  function getAssignment(){
    return this.assignment; 
  }

  function getStudentGrades(){
    return $http.get("/studentGrade")
    .success(function(data){
      console.log(data);
      return data;
    })
    .error(function(){
      return "error"
    })
  }

  function getProfessorGrades(classes){
    return $http.post("/ProfessorGrade",classes)
    .success(function(data){
      console.log(data)
    })
    .error(function(){

    })
  }


  function setGrade(setGrade){
    grade = setGrade;
  }

  function getGrade(){
    return grade;
  }

}])