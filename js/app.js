(function () {

    timimrecApp = angular.module('timerecApp');

    timimrecApp.config(function ($stateProvider, $urlRouterProvider) {

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

    timimrecApp.filter('prependZero', function () {
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

    timimrecApp.filter('myfilter', function () {
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
