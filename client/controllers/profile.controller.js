var app = angular.module("app");

app.factory("socket",function(){
    var socket = io.connect("http://localhost:3000")
    return socket
})

app.controller('profileController', ['$scope','userService','$location','socket','$timeout','ModalService','announcementService','contentService',
  "assignmentService",function($scope, userService,$location,socket,$timeout,ModalService,announcementService,contentService,assignmentService){
  
  $scope.announcements = [];
  $scope.contents = [];
  $scope.assignments = [];
  $scope.grades = [];
  $scope.filterButton = "all";


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
        return studentClass.class_id == data.class_id;
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

  

 
  //---------------------------------------------------------announcement function----------------------------------------------
  //get announcements
  var getAnnouncements = function(){
    announcementService.getAnnoucements()
    .then(function(result){
      var data = result.data;
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
  var findElement = function(object,target){
    var targetArray = [];
    if(target == "announcement"){
      targetArray = $scope.announcements;
    }
    else if(target == "content"){
      targetArray = $scope.contents;
    }
    else if(target == "assignment"){
      targetArray = $scope.assignments;
    }
    else if(target == "grade"){
      targetArray = $scope.grades;
    }
    for(var i = 0; i < targetArray.length; i++){
      if(JSON.stringify(targetArray[i]) === JSON.stringify(object)){
        return i;
      }
    }
  }


  //--------------------------------------------------------- announcement modals--------------------------------------------------
  $scope.addAnnouncementModal = function(){
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

  $scope.showAnnoucementDetailModal = function(announcement){
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
              $scope.announcements.splice(findElement(announcement,"announcement"),1);
            })
            }
        });
      });
  }


  //--------------------------------------------------------- announcement sockets--------------------------------------------------
  //socket: Adding announcement 
  socket.on("addAnnouncement",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.announcements.unshift(data);
      });
    }
  })



  //socket: deleting anouncement 
  socket.on("deleteAnnouncement",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.announcements.splice(findElement(data,"announcement"),1);
      });
    }
  })






  //---------------------------------------------------------content function----------------------------------------------
  //get content
  var getContents = function(){
    contentService.getContents()
    .then(function(result){
      var data = result.data;
      for(var i = 0; i < $scope.classes.length; i++){
        for(var j = 0; j < data.length; j++){
          if(data[j].class_id === $scope.classes[i].class_id){
            $scope.contents.unshift(data[j]);
          }
        }
      }
      $scope.contents.sort(compare);
    })
    .catch(function(){

    })
  }


  //--------------------------------------------------------- content modals--------------------------------------------------
  var clearAndGetContent = function(){
    $scope.contents.length = 0;
    getContents();
  }
  $scope.addContentModal = function(){
    userService.setClass($scope.selectedClass);
    ModalService.showModal({
        templateUrl: "./partials/addContentModal.html",
        controller: "addContent"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            $scope.contents.unshift(result);
          }
        });
      });
  }

  $scope.showContentDetailModal = function(content){
    contentService.setContent(content);
    ModalService.showModal({
        templateUrl: "./partials/detailContentModal.html",
        controller: "detailContent"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        userService.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            contentService.deleteContent(content)
            .then(function(){
              $scope.contents.splice(findElement(content,"content"),1);
            })
            }
        });
      });
  }

  //--------------------------------------------------------- content sockets--------------------------------------------------
  socket.on("uploadContent",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.contents.unshift(data);
      });
    }
  })



  //socket: deleting anouncement 
  socket.on("deleteContent",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.contents.splice(findElement(data,"content"),1);
      });
    }
  })




  //---------------------------------------------------------assignment function----------------------------------------------

  var getAssignment = function(id,target){
    if(target == "student"){
      assignmentService.getStudentAssignment(id)
      .then(function(result){
        $scope.assignments = result.data.reverse();
      })
    }
    else{
      assignmentService.getProfessorAssignment(id)
      .then(function(result){
        $scope.assignments = result.data.reverse();
      })
    }
  }





  //--------------------------------------------------------- assignment modals--------------------------------------------------
  $scope.showAssignmentDetailModal = function(assignment,index){
    assignmentService.setAssignment(assignment);
    ModalService.showModal({
        templateUrl: "./partials/detailAssignmentModal.html",
        controller: "detailAssignment"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        userService.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            if($scope.userData.professor_id != null){
              assignmentService.deleteAssignment(assignment)
              .then(function(){
                $scope.assignments.splice(findElement(assignment,"assignment"),1);
              })
            }
            else{
              $scope.assignments.splice(index,1);
              $scope.grades.unshift(result);
            }
          }
        });
      });
  }



  $scope.addAssignmentModal = function(){
    userService.setClass($scope.selectedClass);
    ModalService.showModal({
        templateUrl: "./partials/addAssignmentModal.html",
        controller: "addAssignment"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        
        modal.close.then(function(result) { 

          if(result !== 'cancel'){
            $scope.assignments.unshift(result);
          }
        });
      });
  }


  //--------------------------------------------------------- assignment sockets--------------------------------------------------
  socket.on("uploadAssignment",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.assignments.unshift(data);
      });
    }
  })



  //socket: deleting anouncement 
  socket.on("deleteAssignment",function(data){
    var classResult = filterClass(data);
    if($scope.userData.student_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.assignments.splice(findElement(data,"assignment"),1);
      });
    }
  })


//--------------------------------------------------------- grades function--------------------------------------------------
  var getGrades = function(target, classes){

    if(target === 'student'){
      assignmentService.getStudentGrades()
      .then(function(result){
        $scope.grades = result.data.reverse();
      })
    }
    else{
      assignmentService.getProfessorGrades(classes)
      .then(function(result){
        $scope.grades = result.data[0].reverse();
      })
    }
  }


  $scope.showGradeDetailModal = function(grade){
    assignmentService.setGrade(grade);
    ModalService.showModal({
        templateUrl: "./partials/addGradeAssignment.html",
        controller: "addGrade"
      }).then(function(modal) {

        //it's a bootstrap element, use 'modal' to show it
        modal.element.modal();
        userService.setClass($scope.selectedClass);
        modal.close.then(function(result) { 
          if(result !== 'cancel'){
            console.log(result)
            }
        });
      });
  }

  //--------------------------------------------------------- grade sockets--------------------------------------------------
  socket.on("studentSubmit",function(data){
    var classResult = filterClass(data);
    if($scope.userData.professor_id !== null && classResult.length > 0){
      $scope.$apply(function(){
        $scope.grades.unshift(data);
      });
    }
  })

  socket.on("submitGrade",function(data){
    if($scope.userData.student_id == data.newGrade.student_id){
      $scope.$apply(function(){
        $scope.assignments.splice(findElement(data.oldGrade,"grade"),1);
        $scope.grades.unshift(data.newGrade);
      });
    }
  })



  //---------------------------------------------------------loading screen--------------------------------------------
  var loading_screen = pleaseWait({
    logo: "../images/bento.png",
    backgroundColor: '#D1D5D8',
    loadingHtml: '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'
  });



  


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
          getContents();
          getAssignment($scope.userData.student_id, "student");
          getGrades("student",null);
        })
        .catch(function(){
          $location.path("/");

        })
      }
      else{
        userService.setProfessorID($scope.userData.professor_id);
        userService.getProfessorClass()
        .then(function(classData){
          $scope.classes = classData.data;
          $scope.name = userService.getUserName();
          $timeout(function(){
            loading_screen.finish();
          },1000)
          getAnnouncements();
          getContents();
          getAssignment($scope.userData.professor_id, "professor");
          getGrades("professor",$scope.classes);
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