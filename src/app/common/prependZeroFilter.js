(function () {

    angular.module('timerecApp').filter('prependZeroFilter', function () {
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
