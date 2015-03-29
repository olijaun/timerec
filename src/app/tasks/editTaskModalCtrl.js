'use strict';
(function () {
    angular.module('timerecApp').controller('EditTaskModalInstanceCtrl', ['$modalInstance', 'parent', 'selectedTaskId', function ($modalInstance, parent, selectedTaskId) {

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
