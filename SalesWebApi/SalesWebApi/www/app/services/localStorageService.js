'use strict';
angular
   .module('salesApp.localStorageService', []).factory('localStorageService', [localStorageService]);
function localStorageService() {
    function clearToken(token) {
        localStorage.removeItem(token);
        sessionStorage.removeItem(token);
    };
    function setToken(token, value, persistent) {
        if (persistent) {
            localStorage[token] = value;
        } else {
            sessionStorage[token] = value;
        }
    };
    function getToken(token) {
        return sessionStorage[token] || localStorage[token];
    }

    function isAuth() {
        if (getToken("salesAppAccessToken") !== undefined) return true;
        else return false;
    }
    function getSecurityHeaders() {
        var accessToken = getToken("salesAppAccessToken");

        if (accessToken) {
            return { "Authorization": "Bearer " + accessToken };
        }

        return {};
    }

    return {

        getSecurityHeaders: getSecurityHeaders,
        isAuth: isAuth,
        getToken: getToken,
        setToken: setToken,
        clearToken: clearToken
    };
};