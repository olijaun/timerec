'use strict';
(function () {
    angular.module('timerecApp').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/records');

        $stateProvider
            .state('records', {
                url: '/records',
                templateUrl: 'app/records/records.html',
                controller: 'RecordsCtrl as vm'
            })
            .state('report', {
                url: '/report',
                templateUrl: 'app/report/report.html',
                controller: 'ReportCtrl as vm'
            })
            .state('tasks', {
                url: '/tasks',
                templateUrl: 'app/tasks/tasks.html',
                controller: 'TasksCtrl as vm'
            });
    });

})();
