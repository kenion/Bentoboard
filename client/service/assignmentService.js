var app = angular.module("app");

var assignment = {};
app.service("assignmentService",["$http",function($http){

  return({
    getStudentAssignment: getStudentAssignment,
    getProfessorAssignment: getProfessorAssignment,
    setAssignment: setAssignment,
    getAssignment: getAssignment,
    deleteAssignment: deleteAssignment
  })

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
}])