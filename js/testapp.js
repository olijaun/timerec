(function () {

    testApp = angular.module('testApp', []);

    testApp.controller('MainCtrl', function ($scope) {
        var vm = this;

        vm.dateList = [];

        vm.selectedDate = new Date();

        vm.updateStuff = function () {
            console.log('update stuff' + vm.selectedDate);
            vm.dateList.push("" + vm.selectedDate);
        };
    });

    testApp.directive('monthSelection', function () {
        return {
            restrict: 'E',
            templateUrl: 'monthSelection.html',
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
                    console.log('eval ng-change')
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

    testApp.directive('monthSelectionOld', function () {
        return {
            restrict: 'E',
            templateUrl: 'monthSelection.html',
            scope: {
                dateChanged: "&monthSelectionChange",
                ngModel: '='
            },
            controller: function () {
                var vm = this;

                console.log('ng-model: ' + vm.ngModel);
                console.log('init selected date: ' + vm.ngModel);

                vm.year = vm.ngModel.getFullYear();
                vm.month = vm.ngModel.getMonth() + 1;
                vm.monthOptions = [
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

                vm.selectedMonth = vm.monthOptions[vm.ngModel.getMonth()];

                vm.updateDate = function () {
                    var newDate = new Date(vm.year, vm.selectedMonth.id - 1, 1);
                    console.log('directive new year: ' + newDate);
                    //vm.date = newDate;
                    //vm.dateList.push("" + newDate);
                    vm.ngModel = newDate;
                    vm.dateChanged();
                }
            },
            controllerAs: 'vm',
            bindToController: true
        }
    });

})();
