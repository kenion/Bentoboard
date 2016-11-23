var app = angular.module("app");

app.controller('detailContent', [ "$scope","close","userService","contentService",function($scope, close,userService,contentService) {

  //Get set announcement
  $scope.content = contentService.getContent();
  console.log($scope.content);

  //Assign date
  $scope.date = new Date($scope.content.date);

  //Check the user type
  $scope.type = userService.getUserType();

  $scope.download = function(){
    contentService.downloadFile($scope.content.class_content_id);
  }
  
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);