(function () {

    timerecApp = angular.module('timerecApp');

    timerecApp.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/records');

        $stateProvider
            .state('records', {
                url: '/records',
                templateUrl: 'records.html',
                controller: 'RecordsCtrl as vm'
            })
            .state('report', {
                url: '/report',
                templateUrl: 'report.html',
                controller: 'ReportCtrl as vm'
            })
            .state('tasks', {
                url: '/tasks',
                templateUrl: 'tasks.html',
                controller: 'TasksCtrl as vm'
            });

    });

    timerecApp.filter('prependZero', function () {
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

    timerecApp.filter('myfilter', function () {
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

    timerecApp.directive('monthSelection', function(){
        return {
            restrict: 'E',
            templateUrl: 'monthSelection.html',
            scope: {
                date: '=',
                //ngModel: "=",
                ngChange : "="
            },
            controller: function() {
                var vm = this;

                console.log('selected date: ' + vm.date);

                vm.year = vm.date.getFullYear();
                vm.month = vm.date.getMonth() + 1;

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

                vm.selectedMonth = vm.monthOptions[vm.date.getMonth()];

                vm.updateDate = function() {
                    console.log('new year: ' + vm.year + ", new month: " + (vm.selectedMonth.id - 1));
                    vm.date = new Date(vm.year, vm.selectedMonth.id - 1, 1);
                    console.log('update date ' + vm.date);
                }
            },
            controllerAs: 'vm',
            bindToController: true
        }
    });

})();
