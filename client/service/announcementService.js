var app  = angular.module("app");

var announcement = {};

app.service("announcementService",["$http","userService",function($http,userService){

  return({
    sendAnnoucement: sendAnnoucement,
    getAnnoucements: getAnnoucements,
    setAnnouncement: setAnnouncement,
    getAnnouncement: getAnnouncement,
    deleteAnnouncement: deleteAnnouncement
  })

  //Setter for announcsment
  function setAnnouncement(response){
    announcement = response;
  }

  //Getter for announcement
  function getAnnouncement(){
    return announcement;
  }

  //Add annoucement 
  function sendAnnoucement(announcement){
    var classInfo = userService.getClass();
    announcement.name = classInfo.name;
    announcement.class_id = classInfo.class_id;
    $http.post('/send/announcement',announcement); 

  }

  //Get annoucments data
  function getAnnoucements(){
    return $http.get("get/announcements")
    .success(function(data){;
      return data;
    })
    .error(function(){

    })
  }

  //Delete annoucement
  function deleteAnnouncement(data){
    console.log(data);
    return $http.post("delete/announcement",data);
  }

  
}])