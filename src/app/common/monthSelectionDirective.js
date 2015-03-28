(function () {

    timerecApp = angular.module('timerecApp');

    timerecApp.directive('monthSelection', function () {
        return {
            restrict: 'E',
            templateUrl: 'src/app/common/month-selection.html',
            require: 'ngModel',
            replace: true,
            link: function (scope, iElement, iAttrs, ngModelCtrl) {

                scope.monthOptions = [
                    {name: "January", id: 1},
                    {name: "February", id: 2},
                    {name: "March", id: 3},
                    {name: "April", id: 4},
                    {name: "May", id: 5},
                    {name: "June", id: 6},
                    {name: "July", id: 7},
                    {name: "August", id: 8},
                    {name: "September", id: 9},
                    {name: "October", id: 10},
                    {name: "November", id: 11},
                    {name: "December", id: 12}
                ];

                ngModelCtrl.$formatters.push(function (modelValue) {
                    return {
                        year: modelValue.getFullYear(),
                        month: scope.monthOptions[modelValue.getMonth()]
                    };
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    var year = viewValue.year;
                    var month = viewValue.month.id;

                    return new Date(year, month - 1, 1);
                });

                scope.updateDate = function() {
                    console.log('change....');
                };

                scope.$watch('year + month.id', function () {
                    ngModelCtrl.$setViewValue({year: scope.year, month: scope.month});
                });

                ngModelCtrl.$viewChangeListeners.push(function() {
                });

                ngModelCtrl.$render = function () {
                    var now = new Date();
                    if (!ngModelCtrl.$viewValue) {
                        ngModelCtrl.$viewValue = {year: now.getFullYear(), month: scope.monthOptions[now.getMonth()]};
                    }
                    scope.year = ngModelCtrl.$viewValue.year;
                    scope.month = ngModelCtrl.$viewValue.month;
                };
            }
        };
    });

})();
