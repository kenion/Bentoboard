var app = angular.module("app");

app.factory('services',['$q','$http',function($q,$http){
  var user = null;
  var userData = {};
  var userName = {};
  var selectedClass = {};
  var announcement = {};

  return({
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    getUserStatus: getUserStatus,
    getInformation: getInformation,
    getStudentClass: getStudentClass,
    getProfessorClass: getProfessorClass,
    getUserName: getUserName,
    getClass: getClass,
    setClass: setClass,
    sendAnnoucement: sendAnnoucement,
    getAnnoucements: getAnnoucements,
    setAnnouncement: setAnnouncement,
    getAnnouncement: getAnnouncement
  })


  function setAnnouncement(response){
    announcement = response;
  }

  function getAnnouncement(){
    return announcement;
  }

  function isLoggedIn(){
    if(user){
      return true;
    }
    else{
      return false;
    }
  }

  function getStudentClass(){
    return $http.get("student/class")
    .success(function(response){
      console.log(response)
      userName.firstName = response[0].student_first_name;
      userName.lastName = response[0].student_last_name;
      return response;
    })
    .error(function(){
      return {err:"err"}
    })
  }

  function setClass(classData){
    selectedClass = classData;
  }

  function getClass(){
    return selectedClass;
  }

  function getProfessorClass(){
    return $http.get("professor/class")
    .success(function(response){
      console.log(response)
      userName.firstName = response[0].professor_first_name;
      userName.lastName = response[0].professor_last_name;
      return response;
    })
    .error(function(){
      return {err:"err"}
    })
  }

  function getUserName(){
    return userName;
  }

  function login(loginInformation){
    var deferred = $q.defer();

    $http.post('login',loginInformation)
    .success(function(data){
      if(data.err){
        user = false;
        deferred.reject();
      }else{
        user = true;
        deferred.resolve();
      }
    })
    .error(function(){
      user = false;
      deferred.reject();
    });
    return deferred.promise;
  }

  function logout() {
    // create a new instance of deferred
    var deferred = $q.defer();
    // send a get request to the server
    $http.get('/logout')
      // handle success
      .success(function () {
        user = false;
        deferred.resolve();
      })
      // handle error
      .error(function () {
        user = false;
        deferred.reject();
      });
    // return promise object
    return deferred.promise;
  }

  function getUserStatus(){
    return $http.get('status')
    .success(function(data){
      if(data.status){
        user = true;
      }
      else{
        user = false;
      }
    })
    .error(function(data){
      user = false;
    });
  }

  function sendAnnoucement(announcement){
    var classInfo = getClass();
    announcement.name = classInfo.name;
    announcement.class_id = classInfo.class_id;
    $http.post('/send/announcement',announcement); 

  }

  function getAnnoucements(){
    return $http.get("get/announcements")
    .success(function(data){;
      return data;
    })
    .error(function(){

    })
  }


  function getInformation(){
    return $http.get("getUserData")
    .success(function(data){
      console.log(data);
      return data;
    })
    .error(function(err){
      throw err;
    })
  }

}])