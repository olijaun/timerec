(function () {

    var timerecApp = angular.module("timerecApp", ['ui.bootstrap']);

    angular.module('timerecApp').filter('prependZero', function () {
        return function (input) {

            var text = '' + input;

            if (text.length == 1) {
                return "0" + text;
            }
            else {
                return text;
            }
        };
    });

})();
