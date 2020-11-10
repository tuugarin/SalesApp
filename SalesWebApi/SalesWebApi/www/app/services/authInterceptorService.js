'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$rootScope', '$templateCache', 'localStorageService', function ($q, $injector, $rootScope, $templateCache, localStorageService) {

    var authInterceptorServiceFactory = {};
    var _request = function (config) {
        config.headers = config.headers || {};

        var token = localStorageService.getToken("salesAppAccessToken");
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        if (config.url.indexOf('template/') > 0) {
            return config;
        }
        else {
            $rootScope.clearAllAlerts();
            $rootScope.clearInfoes();
        }
        return config;
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            {
                localStorageService.clearToken("salesAppAccessToken");
                var state = $injector.get('$state');
                if (state.name !== 'login')
                    state.go('login', { tokenExpired: true });

                return $q.reject(rejection);
            }
        }

        var alert;
        if (rejection.status === 400) {

            if (rejection.data.ModelState !== undefined) {
                var modelState = rejection.data.ModelState;
                var keys = Object.keys(modelState);
                for (var i = 0; i < keys.length; i++) {
                    $rootScope.alerts = [];
                    $rootScope.alerts.push(modelState[keys[i]][0]);

                }

            }
            else if (rejection.data.Message !== undefined) {

                alert = rejection.data.Message;
                $rootScope.addAlert(alert);
            }


            else {
                alert = rejection.data.error_description !== undefined ? rejection.data.error_description : "Unknown error";
                $rootScope.addAlert(alert);
            }
        }
        else if (rejection.status === 500) {
            if (rejection.config.responseType === "arraybuffer") {
                var decodedString = String.fromCharCode.apply(null, new Uint8Array(rejection.data));
                decodedString = decodeURIComponent(escape(decodedString))
                var obj = JSON.parse(decodedString);
                alert = obj['Message'];
            }
            else
                alert = rejection.data.Message !== undefined ? rejection.data.Message : "Unknown error";
        }
        else if (rejection.status !== 0) {
            alert = rejection.data.error_description !== undefined ? rejection.data.error_description : "Unknown error";
            $rootScope.addAlert(alert);
        }

        //if (alert != null && alert != undefined)
        return $q.reject(rejection);
    };

    var _response = function (response) {
        return response;
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
    authInterceptorServiceFactory.response = _response;

    return authInterceptorServiceFactory;
}]);