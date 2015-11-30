/**
 * Created with JetBrains WebStorm.
 * User: Emmanuel Meinike
 * Date: 04/10/13
 * Time: 16:36
 * To change this template use File | Settings | File Templates.
 */

'use strict';

var app = angular.module('livoQApp',['ui.bootstrap','ngAnimate','ngRoute']);

app.config(function($routeProvider,$httpProvider,$locationProvider){
    //$locationProvider.html5Mode(true);
    //$locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
        .when('/login',
        {
            controller: 'LoginController',
            templateUrl: 'login.html'
        })
        .when('/passreset',
        {
            controller: 'PasswordResetController',
            templateUrl: 'passreset.html'
        })
        .when('/register',
        {
            controller: 'RegisterController',
            templateUrl: 'register.html'
        })
        .when('/ask',
        {
            controller: 'AskController',
            templateUrl: 'ask.html'
        })
        .when('/home',
        {
            controller: 'HomeController',
            templateUrl: 'home.html'
        })
        .when('/answer',
        {
            controller: 'AnswerController',
            templateUrl: 'answer.html'
        })
        .when('/myquestions',
        {
            controller: 'MyQuestionsController',
            templateUrl: 'myquestions.html'
        })
        .when('/settings',
        {
            controller: 'SettingsController',
            templateUrl: 'settings.html'
        })
        .when('/public',
        {
            controller: 'PublicController',
            templateUrl: 'public.html'
        })
        .when('/feedback',
        {
            controller: 'FeedbackController',
            templateUrl: 'feedback.html'
        })
        .otherwise({redirectTo:'/home'});


    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.run(function($rootScope,$location){
    $rootScope.$on("$routeChangeStart", function(event, next,current){

        if(sessionStorage.loggedIn == null){
           if(!(next.templateUrl == 'login.html') && !(next.templateUrl == 'register.html')
               && !(next.templateUrl == 'passreset.html') && !(next.templateUrl == 'public.html')){
               $location.path('/login');
           }
       }
    });
});