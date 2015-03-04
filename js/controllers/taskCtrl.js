(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('TaskCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

        $scope.property = StorageService.theNumber;

        var vm = this;

        vm.year = new Date().getFullYear();
        vm.month = new Date().getMonth() + 1;

        vm.myday = undefined;

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

        vm.startTask = function (taskId) {
            var now = new Date();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            vm.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
            StorageService.storeRecords(vm.year, vm.selectedMonth.id, vm.records);

            vm.records = StorageService.getRecords(vm.year, vm.selectedMonth.id);
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
                size: size
                //resolve: {
                //    items: function () {
                //        return $scope.items;
                //    }
                //}
            });

            modalInstance.result.then(function (selectedItem) {
                console.log('result: ' + selectedItem);
                console.log('day: ' + vm.myday);
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.closeModal = function () {
            //vm.close();
        }


    }]);

    timerecApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


})();
