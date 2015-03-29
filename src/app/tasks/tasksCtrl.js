'use strict';
(function () {
    angular.module('timerecApp').controller('TasksCtrl', ['StorageService', '$modal', function (StorageService, $modal) {

        var vm = this;

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: 'Stop', selectable: false};
            return ts;
        }();

        vm.openEditDialog = function (selectedTaskId) {

            var modalInstance = $modal.open({
                templateUrl: 'app/tasks/edit-task-modal.html',
                controller: 'EditTaskModalInstanceCtrl',
                controllerAs: 'vm',
                //size: size,
                resolve: {
                    parent: function () {
                        return vm;
                    },
                    selectedTaskId: function () {
                        return selectedTaskId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                console.log('result: ' + selectedItem);
            }, function () {
            });
        };

        vm.addTask = function (taskId, name, selectable) {

            vm.tasks[taskId] = {name: name, selectable: selectable};
            StorageService.storeTasks(vm.tasks);

            vm.tasks = StorageService.getTasks();
        };

        vm.deleteTask = function (taskId) {
            delete vm.records[taskId];
            StorageService.storeTasks(vm.tasks);

            vm.tasks = StorageService.getTasks();
        };

        vm.updateTask = function (taskId, name, selectable) {
            vm.addTask(taskId, name, selectable);
        };

        vm.closeModal = function () {
        };
    }]);
})();
