var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('profileController', ['$scope','services','$location','socket','$timeout','ModalService', function($scope, services,$location,socket,$timeout,ModalService){
  
  $scope.showModal = function(){
    ModalService.showModal({
        templateUrl: "./partials/addAnnoucement.modal.view.html",
        controller: "addAnnouncement"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        services.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            services.sendAnnoucement(result);
          }
        });
      });
  }

  $scope.showDetailModal = function(announcement){
    services.setAnnouncement(announcement);
    ModalService.showModal({
        templateUrl: "./partials/detailAnnouncement.modal.view.html",
        controller: "detailAnnouncement"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        services.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            services.sendAnnoucement(result);
          }
        });
      });
  }

  $scope.logout = function(){
    services.logout()
    .then(function(){
      $location.path('/');
    })
  }


 

  $scope.announcements = [];

  var filterClass = function(data){
    var array = $scope.classes.filter(function(studentClass){
        return studentClass.class_id === data.class_id;
    });

    return array;
  }


  var getAnnouncements = function(){
    services.getAnnoucements()
    .then(function(result){
      var data = result.data;
      console.log(result);
      for(var i = 0; i < $scope.classes.length; i++){
        for(var j = 0; j < data.length; j++){
          if(data[j].class_id === $scope.classes[i].class_id){
            $scope.announcements.unshift(data[j]);
          }
        }
      }
    })
    .catch(function(){

    })
  }





  $scope.classFilter = function(classData){
    $scope.classID = classData.class_id;
    $scope.selectedClass = classData;
  }

  $scope.showAll = function(){
    $scope.classID = undefined;
  }


  var loading_screen = pleaseWait({
    logo: "../images/bento.png",
    backgroundColor: '#D1D5D8',
    loadingHtml: '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'
  });

  services.getInformation()
  .then(function(data){
    $scope.userData = data.data;
    //For Student
    if($scope.userData.student_id !== null){
      services.getStudentClass()
      .then(function(classData){
        $scope.classes = classData.data;
        $scope.name = services.getUserName();
        $timeout(function(){
          loading_screen.finish();
        },1000)
        getAnnouncements();
      })
      .catch(function(){

      })
    }
    else{
      services.getProfessorClass()
      .then(function(classData){
        $scope.classes = classData.data;
        $scope.name = services.getUserName();
        $timeout(function(){
          loading_screen.finish();
        },1000)
        getAnnouncements();
      })
      .catch(function(){

      })
    }
  });

  socket.on("1",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.announcements.unshift(data);
      });
    }
  })
  

  

}])