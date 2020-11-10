'use strict';
angular
   .module('salesApp.loadingBoxService', []).factory('loadingBoxService', ['$rootScope', '$timeout', loadingBoxService]);
function loadingBoxService($rootScope, $timeout) {
    var delayLoadingBox = 1000;
    function _delayShowLoadingBox(delayLoadingBox) {
        return $timeout(function () {
            $rootScope.isDataLoading = true;
        }, delayLoadingBox);

    }
    return { delayShowLoadingBox: _delayShowLoadingBox };
};