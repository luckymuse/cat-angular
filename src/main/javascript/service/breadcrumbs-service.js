'use strict';
angular.module('cat.service').service('$breadcrumbs', function () {
    var _bc = [];

    this.clear = function (bc) {
        _bc = [];
    };

    this.set = function (bc) {
        _bc = bc;
    };

    this.get = function () {
        return _bc;
    };

    this.push = function (entry) {
        _bc.push(entry);
    };

    this.pop = function () {
        _bc.pop();
    };

    this.length = function () {
        return _bc.length;
    };

    this.replaceLast = function (newVal) {
        _bc[_bc.length - 1] = newVal;
    };
});