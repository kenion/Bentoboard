var app = angular.module("app");

app.controller('addGrade', [ "$scope","close","userService","assignmentService",function($scope, close,userService,assignmentService) {

  //Get set announcement
  $scope.grade = assignmentService.getGrade();
  console.log($scope.grade);
  var oldGrade = assignmentService.getGrade();


  $scope.download = function(){
    assignmentService.downloadStudentFile($scope.grade.assignment_ref_student_id);
  }

  $scope.submitGrade = function(){
    var gradeHolder = {}
    $scope.grade.grade = $scope.givenGrade;
    $scope.grade.professor_comment = $scope.professorComment;
    gradeHolder.oldGrade = oldGrade;
    gradeHolder.newGrade = $scope.grade;

    assignmentService.submitGrade(gradeHolder);
  }
  //Check the user type
  $scope.type = userService.getUserType();

  $scope.commentFieldChecker = function(){
    if($scope.type == 'student' && $scope.grade.grade == null){
      return true
    }
    return false;
  }
  
  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);