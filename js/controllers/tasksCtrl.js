(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('TasksCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {

        var vm = this;

        vm.tasks = function () {
            var ts = StorageService.getTasks();
            ts.stop = {name: "Stop", selectable: false};
            return ts;
        }();

        vm.openEditDialog = function (index) {

            var modalInstance = $modal.open({
                templateUrl: 'editTaskModal.html',
                controller: 'EditTaskModalInstanceCtrl',
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

    timerecApp.controller('EditTaskModalInstanceCtrl', ['$scope', '$modalInstance', 'parent', 'index', function ($scope, $modalInstance, parent, index) {


        var vm = this;

        vm.parent = parent;
        vm.editMode = (index >= 0);

        if (vm.editMode) {
            vm.taskId = vm.parent.tasks;
            vm.taskName;
            vm.selectable;
        } else {
            vm.taskId = null;
            vm.taskName = null;
            vm.selectable = true;
        }
    }]);
})();
