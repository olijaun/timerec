'use strict';
(function () {
    angular.module('timerecApp').filter('invisibleTaskFilter', function () {

        return function (input) {

            var output = {};

            for (var key in input) {
                if (input.hasOwnProperty(key)) {

                    if (input[key].selectable) {

                        output[key] = input[key];
                    }
                }
            }
            return output;
        };
    });

})();
