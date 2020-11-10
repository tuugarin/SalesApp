'use strict';
angular
    .module('salesApp.main', ['ui.router', 'salesApp.dataService', 'ngFileUpload'])
    .controller('MainCtrl', [ '$scope', '$state', 'dataService', 'Upload', 'loadingBoxService', 'localStorageService', MainCtrl]);
function MainCtrl($scope, $state, dataService, Upload, loadingBoxService, localStorageService) {
    var vm = this;
    vm.logout = function loginout() {
        var promise = dataService.logout();
        promise.then(function (response) {
            $state.go('login');

        }, function (badresponse) {
        });

    };
};