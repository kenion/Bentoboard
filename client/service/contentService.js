var app = angular.module("app");
var content = {};

app.service("contentService",["$http","$window",function($http,$window){

  return({
    getContents: getContents,
    deleteContent: deleteContent,
    uploadContent: uploadContent,
    getContent: getContent,
    setContent: setContent,
    downloadFile: downloadFile
  })

  function setContent(content){
    this.content = content;
  }

  function getContent(){
    return this.content;
  }

  function getContents(){
    return $http.get("/getContents")
    .success(function(data){
      console.log(data);
      return data;
    })
  }

  function deleteContent(content){
    return $http.post("/deleteContent/", content)
    .success(function(response){
      return response;
    })
  }

  function uploadContent(content){
    return $http.post("uploadContent",content)
    .success(function(response){
      return response;
    })
  }

  function downloadFile(id){
    return $http.get("downloadFile/"+id).
    success(function(data, status, headers, config) {
        $window.open('/downloadFile/'+id); //does the download
      })
  }

}])