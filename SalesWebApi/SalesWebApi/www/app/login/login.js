'use strict';

angular
    .module('salesApp.login', [])
    .controller('LoginCtrl', ['$timeout', '$scope', '$rootScope', 'dataService', '$state', '$stateParams', 'localStorageService', LoginCtrl]);
function LoginCtrl($timeout, $scope, $rootScope, dataService, $state, $stateParams, localStorageService) {

    var vm = this;

    $scope.$on('$includeContentLoaded', function (event, templateName) {
        if ($stateParams.tokenExpired === true)
            $timeout(function () { $rootScope.addAlert("Session expired"); }, 0);
    });

    vm.login = function login() {
        if (!vm.username || !vm.password) return;
        vm.dataLoading = true;
        vm.promise = dataService.login(vm.username, vm.password);
        vm.promise.then(function (response) {
                vm.dataLoading = false;
                $state.go('index');
        }, function (badresponse) {
            vm.dataLoading = false;
        });
    };


}
