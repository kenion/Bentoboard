var app = angular.module("app");

app.controller('loginController', ['$scope','services','$location', function($scope,services,$location){

  $scope.login = function () {

    // initial values
    $scope.error = false;
    $scope.disabled = true;
    // call login from service
    services.login($scope.loginValue)
      // handle success
      .then(function () {
        $location.path('/profile');
        $scope.disabled = false;
        $scope.loginValue = {};
      })
      // handle error
      .catch(function () {
        $scope.error = true;
        $scope.errorMessage = "Invalid username and/or password";
        $scope.disabled = false;
        $scope.loginValue = {};
      });

  };
  
}])