var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('classController', ['$scope','services','$location','socket', '$routeParams', function($scope,services,$location,socket,$routeParams){
  var socket= io();
  
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
    $location.path('/class/'+classData.class_id)
  }
  services.setClass($routeParams.class_id);
  console.log(services.getClass());
}])