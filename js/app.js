(function () {

    timimrecApp = angular.module('timerecApp');

    timimrecApp.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/ratings');

        $stateProvider
            .state('records', {
                url: '/records',
                templateUrl: 'records.html',
                controller: 'RecordsCtrl as vm'
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

})();
