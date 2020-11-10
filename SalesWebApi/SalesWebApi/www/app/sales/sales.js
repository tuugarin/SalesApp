

var historyModule = angular
    .module('salesApp.sales', ['salesApp.sales.dataservice'])
    .controller('salesCtrl', ['$scope', 'salesDataService', salesCtrl]);

function salesCtrl($scope, salesDataService) {
    var vm = this;
    vm.data = [];
    vm.dislpayedCollection = [];
    $scope.$on('$stateChangeStart', function (event, newUrl, oldUrl) {

        if (vm.promise !== null)
            vm.promise.abort();
    });

    vm.SelectPage = function (page) {
        if (vm.currentPage === page) return;
        vm.currentPage = page;
        vm.GetPage();
    }
    vm.reverse = true;
    vm.searchText = '';
    vm.order = function () {
        vm.reverse = !vm.reverse;
        vm.GetPage();
    };
    vm.search = function () {
        vm.currentPage = 1;
        vm.GetPage();
    };
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.pagesLength = 1;
    vm.startPage = 1;
    vm.middlePage = 2;
    vm.lastPage = 3;
    vm.MovePageForward = function () {
        if (vm.lastPage >= vm.pagesLength) return;

        vm.startPage += 1;
        vm.middlePage += 1;
        vm.lastPage += 1;
        vm.currentPage = vm.startPage;
        vm.GetPage();
    };
    vm.MovePageBack = function () {
        if (vm.startPage <= 1) return;

        vm.startPage -= 1;
        vm.middlePage -= 1;
        vm.lastPage -= 1;
        vm.currentPage = vm.lastPage;
        vm.GetPage();
    };

    vm.pageSize = 15;
    vm.GetPage = function () {

        vm.promise = salesDataService.getAllByPage(vm.currentPage, vm.pageSize, encodeURI(vm.searchText), vm.reverse);
        var promise = vm.promise;
        promise.then(function (response) {
            if (response === undefined) return;

            vm.data = response.list;
            vm.dislpayedCollection = [].concat(response.list);
            vm.pagesLength = Math.ceil(response.count / vm.pageSize);
            vm.totalItems = response.count;

        }, function (badresponse) {
            //error handling
        });
    };
    vm.GetAll = function () {
        vm.promise = salesDataService.getAll();
        var promise = vm.promise;
        promise.then(function (response) {
            if (response === undefined) return;
            vm.data = response;
            vm.dislpayedCollection = [].concat(response);
            vm.pagesLength = Math.ceil(response.Count / vm.pageSize);
            vm.totalItems = response.length;

        }, function (badresponse) {
            //error handling
        });
    };
    vm.Delete = function (item) {
        vm.promise = salesDataService.deleteRecord(item.id);
        var promise = vm.promise;
        promise.then(function (response) {
            if (response === undefined) return;

            vm.GetPage();
          
        }, function (badresponse) {
            //error handling
        });
    }
    vm.DeleteAll = function () {
        vm.promise = salesDataService.deleteAll();
        var promise = vm.promise;
        promise.then(function (response) {
            if (response === undefined) return;
            vm.currentPage = 1;
            vm.pagesLength = 1;
            vm.startPage = 1;
            vm.middlePage = 2;
            vm.lastPage = 3;
            vm.GetPage();

        }, function (badresponse) {
            //error handling
        });
    }
     vm.GetPage();
}
