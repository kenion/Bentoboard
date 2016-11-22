var app = angular.module("app",['ngRoute', 'angular-loading-bar','angularModalService'])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
     cfpLoadingBarProvider.includeSpinner = true;
     cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';      
  }])

app.config(function ($routeProvider) {
  $routeProvider
  .when('/',{
    templateUrl: '/partials/login.view.html',
    controller: 'loginController',
    access: {restricted: false}
  })
  .when('/profile',{
    templateUrl: '/partials/profile.view.html',
    controller: 'profileController',
    access: {restricted: true}
  })
  .otherwise({redirectTo:'/'})
})

app.run(function ($rootScope, $location, $route, userService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      userService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !userService.isLoggedIn()){
          $location.path('/');
          $route.reload();
        }
        else if(userService.isLoggedIn() && (next.originalPath === '/')){
          $location.path('/profile');
        }
      });
  });
});