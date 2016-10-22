var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('classController', ['$scope','services','$route','socket', function($scope,services,$route){
  var socket= io();
  var announcement = {};
  
  services.getInformation()
  .then(function(data){
    $scope.userData = data.data;
    //For Student
    if($scope.userData.student_id !== null){
      services.getStudentClass()
      .then(function(classData){
        $scope.classes = classData.data;
        $scope.name = services.getUserName();
      })
      .catch(function(){

      })
    }
    else{
      services.getProfessorClass()
      .then(function(classData){
        $scope.classes = classData.data;
        $scope.name = services.getUserName();
      })
      .catch(function(){

      })
    }
  });

  $scope.commitAnnouncement = function(announcement){
    services.sendAnnoucement(announcement);
  }

  $scope.classRoute = function(classData){
    services.setClass(classData);
    $route.reload();
  }
  console.log(services.getClass());
}])