
var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    var home = {
        name: "home",
        url: '/home',
        templateUrl: 'app/views/home.html',
        controller: 'HomeController as homeCtrl'
    }

    $stateProvider.state(home);

});