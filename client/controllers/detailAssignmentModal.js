var app = angular.module("app");

app.controller('detailAssignment', [ "$scope","close","userService","assignmentService","$http",function($scope, close,userService,assignmentService,$http) {

  //Get set announcement
  $scope.assignment = assignmentService.getAssignment();

  //Assign date
  $scope.date = new Date($scope.assignment.date);

  //Check the user type
  $scope.type = userService.getUserType();

  $scope.download = function(){
    assignmentService.downloadFile($scope.assignment.assignment_id);
  }

  $scope.submitAssignment = function(){
      var file = $scope.myFile;
      var uploadUrl = "http://localhost:3000/submitAssignment";
      var fd = new FormData();
      
      fd.append('file',file);
      fd.append('assignmentID', $scope.assignment.assignment_id);
      fd.append('comment', $scope.comment);

      $http.post(uploadUrl,fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      })
      .success(function(data){

        if(data.error){
          $scope.error = data.error;
        }        
        else{

          $scope.close(data);
        }
        
      })
      .error(function(){
        console.log("error!!");
      });
    };
  
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);