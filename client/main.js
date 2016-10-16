var app = angular.module("app",['ngRoute']);

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
})

app.run(function ($rootScope, $location, $route, services) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      services.getUserStatus()
      .then(function(){
        if (next.access.restricted && !services.isLoggedIn()){
          $location.path('/');
          $route.reload();
        }
        else if(services.isLoggedIn() && (next.originalPath === '/')){
          $location.path('/profile');
        }
      });
  });
});