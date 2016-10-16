var app = angular.module("app");

app.controller('profileController', ['$scope','services', function($scope, services){
  services.getInformation()
  .then(function(data){
    $scope.userData = data;
  });

}])