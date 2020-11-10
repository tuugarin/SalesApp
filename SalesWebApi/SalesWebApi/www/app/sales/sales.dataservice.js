'use strict';

angular
    .module('salesApp.sales.dataservice', [])
    .factory('salesDataService', ['dataService', SalesDataService]);

function SalesDataService(dataService) {
    var salesDataService = {};
    var getAllSalesUrl = "api/Sales";

    var getAllSalesByPageUrl = function (pageNumber, pageSize, searchText, desc) {
        return "api/Sales?page=" + pageNumber + "&pageSize=" + pageSize + "&searchText=" + searchText + "&orderDirection=" + desc;
    };

    function _getAll() {
        return dataService.getAll(getAllSalesUrl);
    }
    function _getPage(pageNumber, pageSize, sortBy, searchText, desc) {
        return dataService.getAll(getAllSalesByPageUrl(pageNumber, pageSize, sortBy, searchText, desc));
    }
    function _delete(id) {
        return dataService.delete("api/Sales/" + id);
    }
    function _deleteAll() {
        return dataService.delete("api/Sales");
    }

    salesDataService.getAll = _getAll;
    salesDataService.getAllByPage = _getPage;
    salesDataService.deleteRecord = _delete;
    salesDataService.deleteAll = _deleteAll;
    return salesDataService;
}