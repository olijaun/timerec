(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('TasksCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

        var vm = this;

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: "Stop", selectable: false};
            return ts;
        }();

        vm.openEditDialog = function (selectedTaskId) {

            var modalInstance = $modal.open({
                templateUrl: 'editTaskModal.html',
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
                //console.log('day: ' + vm.myday);
                //$scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.addTask = function(taskId, name, selectable) {

            vm.tasks[taskId] = {name: name, selectable: selectable};
            StorageService.storeTasks(vm.tasks);

            vm.tasks = StorageService.getTasks();
        };

        vm.deleteTask = function(taskId) {
            delete vm.records[taskId];
            StorageService.storeTasks(vm.tasks);

            vm.tasks = StorageService.getTasks();
        };

        vm.updateTask = function(taskId, name, selectable) {
            vm.addTask(taskId, name, selectable);
        };

        vm.closeModal = function () {
        };
    }]);

    timerecApp.controller('EditTaskModalInstanceCtrl', ['$scope', '$modalInstance', 'parent', 'selectedTaskId', function ($scope, $modalInstance, parent, selectedTaskId) {

        var vm = this;

        vm.parent = parent;
        vm.editMode = (selectedTaskId !== null && selectedTaskId !== undefined);

        if (vm.editMode) {
            vm.taskId = selectedTaskId;
            vm.taskName = vm.parent.tasks[selectedTaskId].name;
            vm.selectable = vm.parent.tasks[selectedTaskId].selectable;
        } else {
            vm.taskId = null;
            vm.taskName = null;
            vm.selectable = true;
        }

        vm.save = function () {
            vm.parent.updateTask(vm.taskId, vm.taskName, vm.selectable);
            $modalInstance.dismiss('save');
        };

        vm.add = function () {
            vm.parent.updateTask(vm.taskId, vm.taskName, vm.selectable);
            $modalInstance.dismiss('add');
        };

        vm.cancel = function () {
            console.log('selected task: ' + vm.parent.tasks[vm.selectedTask]);
            $modalInstance.dismiss('cancel');
        };

    }]);
})();
