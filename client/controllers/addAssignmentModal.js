var app = angular.module("app");

app.controller('addAssignment', [ "$scope",'userService',"close",'$http',function($scope,userService,close, $http) {


  $scope.uploadFile = function(){
    var file = $scope.myFile;
    var uploadUrl = "http://localhost:3000/uploadAssignment";
    var fd = new FormData();
    var professorID = null;
    
    fd.append('file', file);
    fd.append('body', $scope.body);
    fd.append('assignment_name', $scope.subject);
    fd.append('class_id',userService.getClass().class_id);
    fd.append('professor_id', userService.getProfessorID());

    $http.post(uploadUrl,fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    })
    .success(function(data){

      if(data.error){
        $scope.error = data.error;
      }
      else{

        data.class_id = parseInt(data.class_id);
        data.date = parseInt(data.date);
        console.log(data)
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