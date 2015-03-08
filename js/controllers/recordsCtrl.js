(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('RecordsCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

        var vm = this;

        var now = new Date();
        vm.year = now.getFullYear();
        vm.month = now.getMonth() + 1;
        vm.day = now.getDate();

        vm.monthOptions = [
            {name: "January", id: 1},
            {name: "February", id: 2},
            {name: "March", id: 3},
            {name: "April", id: 4},
            {name: "May", id: 5},
            {name: "June", id: 6},
            {name: "July", id: 7},
            {name: "August", id: 8},
            {name: "September", id: 9},
            {name: "October", id: 10},
            {name: "November", id: 11},
            {name: "December", id: 12}
        ];
        vm.selectedMonth = vm.monthOptions[vm.month - 1];

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: "Stop", selectable: false};
            return ts;
        }();

        vm.records = function () {
            var ts = StorageService.getRecords(vm.year, vm.month);
            return ts;
        }();

        vm.addTask = function (taskId, day, hour, minute) {
            var now = new Date();

            vm.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
            StorageService.storeRecords(vm.year, vm.selectedMonth.id, vm.records);

            vm.records = StorageService.getRecords(vm.year, vm.selectedMonth.id);
        };

        vm.updateTask = function (index, taskId, day, hour, minute) {
            var now = new Date();

            vm.records[index] = {taskId: taskId, day: day, hour: hour, minute: minute};
            StorageService.storeRecords(vm.year, vm.selectedMonth.id, vm.records);

            vm.records = StorageService.getRecords(vm.year, vm.selectedMonth.id);
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
            vm.records = StorageService.getRecords(vm.year, vm.selectedMonth.id);
        };

        vm.deleteRecord = function (index) {
            vm.records.splice(index, 1);
            StorageService.storeRecords(vm.year, vm.selectedMonth.id, vm.records);
            vm.records = StorageService.getRecords(vm.year, vm.selectedMonth.id);
        }

        vm.openEditDialog = function (index) {

            var modalInstance = $modal.open({
                templateUrl: 'editRecordModal.html',
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
                //console.log('day: ' + vm.myday);
                //$scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.closeModal = function () {
            //vm.close();
        }


    }]);

    timerecApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'parent', 'index', function ($scope, $modalInstance, parent, index) {

        var vm = this;
        vm.parent = parent;
        vm.index = index;

        vm.editMode = vm.index >= 0;

        if (vm.editMode) {
            vm.selectedTask = parent.records[vm.index].taskId;
            vm.day = parent.records[vm.index].day;
            vm.startTime = new Date(parseInt(vm.parent.year), parseInt(vm.parent.selectedMonth.id) - 1,
                parseInt(vm.parent.records[vm.index].day), parseInt(vm.parent.records[vm.index].hour), parseInt(vm.parent.records[vm.index].minute));
        } else {
            var now = new Date();
            vm.startTime = new Date(parseInt(vm.parent.year), parseInt(vm.parent.selectedMonth.id) - 1);

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
