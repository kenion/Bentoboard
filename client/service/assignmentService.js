var app = angular.module("app");

var assignment = {};
app.service("assignmentService",["$http",'$window',function($http,$window){

  return({
    getStudentAssignment: getStudentAssignment,
    getProfessorAssignment: getProfessorAssignment,
    setAssignment: setAssignment,
    getAssignment: getAssignment,
    deleteAssignment: deleteAssignment,
    downloadFile : downloadFile
  })

  function downloadFile(id){
    return $http.get("/downloadAssignment/"+id)
    .success(function(data, status, headers, config) {
        $window.open('/downloadAssignment/'+id); //does the download
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
}])