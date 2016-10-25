var app = angular.module("app");

app.controller('addAnnouncement', [ "$scope","close",function($scope, close) {
  
 $scope.close = function(result) {
  close(result, 500); // close, but give 500ms for bootstrap to animate
 };

}]);