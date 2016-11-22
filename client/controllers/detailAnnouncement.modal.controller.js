var app = angular.module("app");

app.controller('detailAnnouncement', [ "$scope","close","userService","announcementService",function($scope, close,userService,announcementService) {

  //Get set announcement
  $scope.announcement = announcementService.getAnnouncement();
  console.log($scope.announcement);

  //Assign date
  $scope.date = new Date($scope.announcement.date);

  //Check the user type
  $scope.type = userService.getUserType();
  
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);