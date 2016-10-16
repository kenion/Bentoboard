var app = angular.module("app");

app.factory('services',['$q','$http',function($q,$http){
  var user = null;
  var userData = {};

  return({
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    getUserStatus: getUserStatus,
    getInformation: getInformation
  })

  function isLoggedIn(){
    if(user){
      return true;
    }
    else{
      return false;
    }
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


  function getInformation(){
    return $http.get("getUserData")
    .success(function(data){
      return data;
    })
    .error(function(err){
      throw err;
    })
  }

}])