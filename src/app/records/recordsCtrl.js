(function () {

    angular.module("timerecApp").controller('RecordsCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

        var vm = this;

        vm.selectedDate = new Date();
        vm.day = vm.selectedDate.getDate();

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: "Stop", selectable: true};
            return ts;
        }();

        vm.records = function () {
            var ts = StorageService.getRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1);
            return ts;
        }();

        vm.addTask = function (taskId, day, hour, minute) {
            vm.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
            StorageService.storeRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1, vm.records);

            vm.records = StorageService.getRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1);
        };

        vm.updateTask = function (index, taskId, day, hour, minute) {
            vm.records[index] = {taskId: taskId, day: day, hour: hour, minute: minute};
            StorageService.storeRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1, vm.records);

            vm.records = StorageService.getRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1);
        };

        vm.startTask = function (taskId) {
            var now = new Date();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            vm.addTask(taskId, day, hour, minute);
        };

        vm.stopTask = function () {
            vm.startTask("stop");
        };

        vm.loadData = function () {
            vm.records = StorageService.getRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1);
        };

        vm.deleteRecord = function (index) {
            vm.records.splice(index, 1);
            StorageService.storeRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1, vm.records);
            vm.records = StorageService.getRecords(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth() + 1);
        };

        vm.openEditDialog = function (index) {

            var modalInstance = $modal.open({
                templateUrl: 'src/app/records/edit-record-modal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'vm',
                //size: size,
                resolve: {
                    parent: function () {
                        return vm;
                    },
                    index: function () {
                        return index;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                console.log('result: ' + selectedItem);
            }, function () {
            });
        };

        vm.closeModal = function () {
        };

    }]);

    timerecApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'parent', 'index', function ($scope, $modalInstance, parent, index) {

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
