'use strict';

angular
    .module('salesApp.upload', ['salesApp.dataService'])
    .controller('UploadCtrl', ['$state','$scope', 'dataService', UploadCtrl]);
// Controller
function UploadCtrl($state, $scope, dataService) {
    var vm = this;
    vm.file = {};
    vm.fileDescription = "";
    vm.max = 200;
    vm.dynamic = 0;
    vm.placeHolder = "Добавьте описание файла, предназначение документа, максимум 200 символов";
    $scope.$on('$stateChangeStart', function (event, newUrl, oldUrl) {
        if (vm.promise !== null)
            vm.promise.abort();

    });
    vm.setfiles = function (files) {
        if (files && files.length) {
            vm.file = files[0];
        }
        else vm.file = undefined;
    }

    vm.upload = function () {
        vm.promise = dataService.upload(vm.file);
        var promise = vm.promise;
        if (promise === null) return;
        promise.then(function (response) {
                $scope.uploadform.$setPristine(true);
                vm.file = {};
                $state.go('index.sales')
        }, function (error) {
            //Обработка ошибки, если необходимо
        });
        
    }
}