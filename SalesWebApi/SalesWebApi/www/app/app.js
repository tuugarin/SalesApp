'use strict';

var app = angular
    .module('salesApp', ['ui.router','salesApp.localStorageService',
        'salesApp.dataService', 'ngSanitize',
        'salesApp.login',
        'salesApp.main',
        'salesApp.sales',
    'salesApp.loadingBoxService',
     'salesApp.upload'
    ]);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
app.config(['$urlRouterProvider', '$stateProvider', "$locationProvider", function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $urlRouterProvider.when('/', '/main');
    $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: 'www/app/login/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'vm',
          data: {
              'noLogin': true
          },
          params: {tokenExpired: undefined}

      })
    .state('index', {
        url: '/',
        templateUrl: 'www/app/main/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
    })
    .state('index.sales', {
        url: 'sales',
        templateUrl: 'www/app/sales/sales.html',
        controller: 'salesCtrl',
        controllerAs: 'vm'
    })
        .state('index.upload', {
            url: 'upload',
            templateUrl: 'www/app/upload/upload.html',
            controller: 'UploadCtrl',
            controllerAs: 'vm'
          })
    ;

}]);
app.run(['$transitions', '$rootScope', '$state', 'localStorageService', '$anchorScroll', function ($transitions, $rootScope, $state, localStorageService, $anchorScroll) {

    $rootScope.typeaheadWait = 300;
    $rootScope.numberOfDecimals = 2;
    $rootScope.filesExtension = ".csv";
    $rootScope.isDataLoading = false;
    $rootScope.alerts = [];
    $rootScope.clearAllAlerts = function () {
        $rootScope.alerts = [];
    };
    $rootScope.clearAllInfoes = function () {

        $rootScope.infoes = [];
    };
    $rootScope.clearAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };
    $rootScope.addAlert = function (msg) {

        $rootScope.alerts = [];
        $rootScope.alerts.push(msg);
        $anchorScroll('top');
    };
    $rootScope.infoes = [];
    $rootScope.clearInfoes = function (index) {
        $rootScope.infoes.splice(index, 1);
    };
    $rootScope.addInfo = function (msg) {
        $rootScope.infoes = [];
        $rootScope.infoes.push(msg);
        $anchorScroll('top');
    };
    $rootScope.footerDate = new Date().getFullYear();

    $rootScope.isRouteLoading = true;


    $transitions.onStart({},function ($transitions) {
    $rootScope.isRouteLoading = true;
    $rootScope.clearAllAlerts();
    $rootScope.clearAllInfoes();
    var toState = $transitions.to();
    if (toState.data !== undefined) {
        if (toState.data.noLogin !== undefined && toState.data.noLogin) {
            if (toState.name === 'login' && localStorageService.isAuth()) {
                $rootScope.isRouteLoading = false;
                $state.go('index');
                return false;
            }
        }
    }
    else {
        if (!localStorageService.isAuth()) {
            $rootScope.isRouteLoading = false;
            $state.go('login');
            return false;

        }
    }

});
    $transitions.onSuccess({},function ($transitions) {
    $rootScope.isRouteLoading = false;
});
    $state.go('index');

}]);
     