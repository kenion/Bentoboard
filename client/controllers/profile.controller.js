var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('profileController', ['$scope','services','$location','socket', function($scope, services,$location,socket){
  
  $scope.announcements = [1];

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

  socket.on("1",function(data){
      var classResult = $scope.classes.filter(function(studentClass){
        return studentClass.class_id === data.class.class_id;
      })
      if($scope.userData.student_id !== null && classResult.length > 0){
        $scope.$apply(function(){
          console.log("hit");
          $scope.announcements.push(data.body);
          console.log($scope.announcements)
        });
      }
  })

  $scope.classRoute = function(classData){
    services.setClass(classData);
    $location.path('/class')
  }

}])