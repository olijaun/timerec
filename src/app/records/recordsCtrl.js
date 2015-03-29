'use strict';
(function () {
    angular.module('timerecApp').controller('RecordsCtrl', ['StorageService', '$modal', function (StorageService, $modal) {

        var vm = this;

        vm.selectedDate = new Date();
        vm.day = vm.selectedDate.getDate();

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: 'Stop', selectable: true};
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
            vm.startTask('stop');
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
                templateUrl: 'app/records/edit-record-modal.html',
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
})();
