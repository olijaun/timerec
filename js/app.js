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
            scope: {year: '=', month: '='},
            controller: function() {
                var vm = this;

                //console.log("yyyyyyyyyear " + bla.year);
                //vm.summary = vm.rating.name + " rated " + vm.rating.grade;

                //vm.click = function(){ alert ('Hello ' + vm.rating.name); };
            },
            controllerAs: 'vm',
            bindToController: true
        }
    });

})();
