var app = angular.module("app");

app.controller('addContent', [ "$scope",'userService',"close",'$http',function($scope,userService,close, $http) {


  $scope.uploadFile = function(){
    var file = $scope.myFile;
    var uploadUrl = "http://localhost:3000/uploadContent";
    var fd = new FormData();
    fd.append('file', file);
    fd.append('body', $scope.body);
    fd.append('subject', $scope.subject);
    fd.append('class_id',userService.getClass().class_id);
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