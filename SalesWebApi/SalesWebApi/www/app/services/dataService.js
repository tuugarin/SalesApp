'use strict';
angular
    .module('salesApp.dataService', ['ngFileUpload'])
    .factory('dataService', ['$http', '$q', 'localStorageService', 'Upload', '$rootScope', '$timeout', 'loadingBoxService', dataService]);

function dataService($http, $q, localStorageService, Upload, $rootScope, $timeout, loadingBoxService) {
    // var delayLoadingBox = 1000;
    var dataService = {};

    var self = this;
    // Routes       
    var loginUrl = "Token",
        logoutUrl = "api/Account/Logout";

    function switchOffLoading(timer) {
        $timeout.cancel(timer);
        $rootScope.isDataLoading = false;
    };

    function login(username, password) {
        var deferred = $q.defer();

        var loginData = {
            grant_type: "password",
            username: username,
            password: password
        };
        var request = {
            method: 'POST',
            url: loginUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: toParam(loginData)
        };

        $http(request)
            .then(function (response) {
                localStorageService.setToken("salesAppAccessToken", response.data.access_token, false);
                deferred.resolve(response);
            }, function (response) {

                deferred.reject(response);
            });
        return deferred.promise;
    }

    function logout() {
        var deferred = $q.defer();
        var timer = loadingBoxService.delayShowLoadingBox();
        $http.post(logoutUrl, {}).then(function (response) {
            localStorageService.clearToken("salesAppAccessToken");
            switchOffLoading(timer);
            deferred.resolve(response.data);
        }, function (response) {
            switchOffLoading(timer);
            deferred.reject(response.data);

        });

        return deferred.promise;
    }


    function getUserInfo() {
        var deferred = $q.defer();
        $http.get(userInfoUrl).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response);
        });
        return deferred.promise;
    }

    function _getAll(url) {
        var deferred = $q.defer();
        var timer = loadingBoxService.delayShowLoadingBox();
        $http.get(url, { timeout: deferred.promise }).then(function (response) {
            switchOffLoading(timer);
            deferred.resolve(response.data);
        },function (response) {
            switchOffLoading(timer);
            deferred.reject(response.data);
        });
        var promise = deferred.promise;
        promise.abort = function () {
            switchOffLoading(timer);
            deferred.resolve();
        };
        return promise;
    }
    
    function _update(url, entity) {
        var deferred = $q.defer();
        var timer = loadingBoxService.delayShowLoadingBox();
        $http.put(url, entity, { timeout: deferred.promise }).then(function (response) {
            switchOffLoading(timer);
            deferred.resolve(response.data);
        },function (response) {
            switchOffLoading(timer);
            deferred.reject(response.data);
        });
        var promise = deferred.promise;
        promise.abort = function () {
            switchOffLoading(timer);
            deferred.resolve();
        };
        return promise;
    }
    function _get(url) {
        var deferred = $q.defer();
        $http.get(url, { timeout: deferred.promise }).then(function (response) {
            deferred.resolve(response.data);
        },function (response) {
            deferred.reject(response.data);
        });
        var promise = deferred.promise;
        promise.abort = function () {
            deferred.resolve();
        };
        return promise;
    }
    function _delete(url) {
        var deferred = $q.defer();
        $http.delete(url, { timeout: deferred.promise }).then(function (response) {
            deferred.resolve(response.data);
        }, function (response) {
            deferred.reject(response.data);
        });
        var promise = deferred.promise;
        promise.abort = function () {
            deferred.resolve();
        };
        return promise;
    }

    function _upload(file) {

        var deferred = $q.defer();
        var timer = loadingBoxService.delayShowLoadingBox();
        var uploadObject = Upload.upload({
            url: '/api/sales/upload',
            file: file,
            timeout: deferred.promise
        }).then(function (response) {
            switchOffLoading(timer);
            deferred.resolve(response.data);
        },function (response) {
            switchOffLoading(timer);
            deferred.reject(response.data);
        });
        var promise = deferred.promise;
        promise.abort = function () {
            if (uploadObject !== null) uploadObject.abort();
            switchOffLoading(timer);
            deferred.resolve();
        };
        return promise;

    }

    dataService.login = login;
    dataService.logout = logout;
    dataService.getUserInfo = getUserInfo;
    dataService.getAll = _getAll;
    dataService.update = _update;
    dataService.get = _get;
    dataService.upload = _upload;
    dataService.delete = _delete;
    return dataService;

}


//Convert param json content to form-urlencoded
function toParam(object, prefix) {
    var stack = [];
    var value;
    var key;

    for (key in object) {
        value = object[key];
        key = prefix ? prefix + '[' + key + ']' : key;

        if (value === null) {
            value = encodeURIComponent(key) + '=';
        } else if (typeof value !== 'object') {
            value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        } else {
            value = toParam(value, key);
        }

        stack.push(value);
    }

    return stack.join('&');
}
