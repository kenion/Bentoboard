var app = angular.module("app");

app.controller('detailAnnouncement', [ "$scope","close","services",function($scope, close,services) {

  $scope.announcment = services.getAnnouncement();
  $scope.date = new Date($scope.announcment.date);
  $scope.type = services.getUserType();
  
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);