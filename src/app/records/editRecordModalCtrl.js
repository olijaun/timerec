'use strict';
(function () {
    angular.module('timerecApp').controller('ModalInstanceCtrl', ['$modalInstance', 'parent', 'index', function ($modalInstance, parent, index) {

        var vm = this;
        vm.parent = parent;
        vm.index = index;

        vm.editMode = vm.index >= 0;

        if (vm.editMode) {
            vm.selectedTask = parent.records[vm.index].taskId;
            vm.day = parent.records[vm.index].day;
            vm.startTime = new Date(vm.parent.selectedDate.getFullYear(), vm.parent.selectedDate.getMonth(),
                parseInt(vm.parent.records[vm.index].day), parseInt(vm.parent.records[vm.index].hour), parseInt(vm.parent.records[vm.index].minute));
        } else {
            var now = new Date();
            vm.startTime = new Date(vm.parent.selectedDate.getFullYear(), vm.parent.selectedDate.getMonth());

            if (now.getFullYear() === vm.startTime.getFullYear() && now.getMonth() === vm.startTime.getMonth()) {
                vm.startTime.setHours(now.getHours());
                vm.startTime.setMinutes(now.getMinutes());
                vm.day = new Date().getDate();
            }
            vm.selectedTask = null;
        }

        vm.save = function () {
            vm.parent.updateTask(vm.index, vm.selectedTask, vm.day, vm.startTime.getHours(), vm.startTime.getMinutes());
            $modalInstance.dismiss('cancel');
        };

        vm.add = function () {
            vm.parent.addTask(vm.selectedTask, vm.day, vm.startTime.getHours(), vm.startTime.getMinutes());
            $modalInstance.dismiss('cancel');
        };

        vm.cancel = function () {
            console.log('selected task: ' + vm.parent.tasks[vm.selectedTask]);
            $modalInstance.dismiss('cancel');
        };
    }]);
})();
