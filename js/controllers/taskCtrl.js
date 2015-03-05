(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('TaskCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

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

        vm.openEditDialog = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'vm',
                size: size,
                resolve: {
                    parent: function() {
                        return vm;
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

    timerecApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'parent', function ($scope, $modalInstance, parent) {

        var vm = this;

        vm.myday = parent.day;
        vm.parent = parent;

        vm.selectedTask = undefined;
        vm.startTime = new Date();

        vm.save = function () {
            parent.startTask('stop');
            $modalInstance.dismiss('cancel');
        };

        vm.add = function () {
            vm.addTask('stop');
            $modalInstance.dismiss('cancel');
        };

        vm.cancel = function () {
            console.log('selected task: ' + vm.parent.tasks[vm.selectedTask].name);
            $modalInstance.dismiss('cancel');
        };
    }]);
})();
