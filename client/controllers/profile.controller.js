var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('profileController', ['$scope','userService','$location','socket','$timeout','ModalService','announcementService',
  function($scope, userService,$location,socket,$timeout,ModalService,announcementService){
  
  $scope.announcements = [];
  $scope.showTab = "class-tab-selected";

  //---------------------------------------------------------user function----------------------------------------------
  //User log out
  $scope.logout = function(){
    userService.logout()
    .then(function(){
      $location.path('/');
    })
  }


  //---------------------------------------------------------class function----------------------------------------------
  $scope.classChange = function(index){
    for(var i = 0; i < $scope.classes.length; i++){
      $scope.classes[i].style = "class-tab-not-selected"
    }
    $scope.showTab = "class-tab-not-selected";

    if(index === -1){
      $scope.showTab = "class-tab-selected";
    }
    else{
      $scope.classes[index].style = "class-tab-selected";
    }
  }

  //get classes assign to user
  var filterClass = function(data){
    var array = $scope.classes.filter(function(studentClass){
        return studentClass.class_id === data.class_id;
    });

    return array;
  }

  //Clear class filter 
  $scope.showAll = function(){
    $scope.classID = undefined;
  }

  var compare = function(a,b){
    if(a.date > b.date){
      return-1;
    }
  }

  //assign class that been clicked on
  //Support function for criteriaMatch
  $scope.classFilter = function(classData){
    $scope.classID = classData.class_id
    $scope.selectedClass = classData;
  }

  //filter class from tabs
  $scope.criteriaMatch = function() {
    if($scope.classID !== undefined){
      return function( item ){
        return $scope.classID === item.class_id;
      }
    }
    else{
      return function(item){
        return true;
      }
    }
  };

  //---------------------------------------------------------modal--------------------------------------------------
  $scope.showModal = function(){
    ModalService.showModal({
        templateUrl: "./partials/addAnnoucement.modal.view.html",
        controller: "addAnnouncement"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        userService.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            var date = new Date();
            result.date = date.getTime();
            announcementService.sendAnnoucement(result);
            $scope.announcements.unshift(result);
          }
        });
      });
  }

  $scope.showDetailModal = function(announcement){
    announcementService.setAnnouncement(announcement);
    ModalService.showModal({
        templateUrl: "./partials/detailAnnouncement.modal.view.html",
        controller: "detailAnnouncement"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        userService.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            announcementService.deleteAnnouncement(announcement)
            .then(function(){
              $scope.announcements.splice(findAnnouncement(announcement),1);
            })
            }
        });
      });
  }

 
  //---------------------------------------------------------announcement function----------------------------------------------
  //get announcements
  var getAnnouncements = function(){
    announcementService.getAnnoucements()
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
      $scope.announcements.sort(compare);
    })
    .catch(function(){

    })
  }


  //Compare announcement postiton in a collection
  var findAnnouncement = function(object){
    for(var i = 0; i < $scope.announcements.length; i++){
      if(JSON.stringify($scope.announcements[i]) === JSON.stringify(object)){
        return i;
      }
    }
  }


  //---------------------------------------------------------loading screen--------------------------------------------
  //loading Screen
  var loading_screen = pleaseWait({
    logo: "../images/bento.png",
    backgroundColor: '#D1D5D8',
    loadingHtml: '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'
  });



  
  //---------------------------------------------------------sockets--------------------------------------------------
  //socket: Adding anouncement 
  socket.on("1",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.announcements.unshift(data);
      });
    }
  })



  //socket: deleting anouncement 
  socket.on("2",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.announcements.splice(findAnnouncement(data),1);
      });
    }
  })


//---------------------------------------------------------init function--------------------------------------------------
  //Initilzation function after logging in 
  
  var getPartofDay = function(){
    var d = new Date();
    var time = d.getHours();
    if(time >= 5 && time <= 12){
      $scope.partOfDay = "Morning";
    }
    else if(time > 12 && time <= 17){
      $scope.partOfDay = "Afternoon";
    }
    else{
      $scope.partOfDay = "Evening";
    }
  }


  var init = function(){
    getPartofDay();
    userService.getInformation()
    .then(function(data){
      $scope.userData = data.data;
      //For Student
      if($scope.userData.student_id !== null){
        userService.getStudentClass()
        .then(function(classData){
          $scope.classes = classData.data;
          $scope.name = userService.getUserName();
          $timeout(function(){
            loading_screen.finish();
          },1000)
          getAnnouncements();
        })
        .catch(function(){
          $location.path("/");

        })
      }
      else{
        userService.getProfessorClass()
        .then(function(classData){
          $scope.classes = classData.data;
          $scope.name = userService.getUserName();
          $timeout(function(){
            loading_screen.finish();
          },1000)
          getAnnouncements();
        })
        .catch(function(){
            $location.path("/");
        })
      }
    });
  }




  //Run init function
  init();

}])