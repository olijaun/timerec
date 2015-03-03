(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('TaskCtrl', ['StorageService', '$scope', function(StorageService, $scope) {

        $scope.property = StorageService.theNumber;

        var vm = this;

        vm.rating = {};
        vm.ratings = [
            {name: 'Will Hunting', grade: 3.50, entered: "2013-08-05"}
        ];

        vm.addRating = function () {
            vm.ratings.push({name: vm.rating.name, grade: vm.rating.grade, entered: new Date()});
            //vm.ratings.push(vm.rating);
            vm.rating = {};
        };

        vm.removeRating = function (item) {
            if (confirm("Remove this rating. Sure?")) {
                vm.ratings.splice(vm.ratings.indexOf(item), 1);
            }
        };

        vm.pluralizer = {
            0: "No rating!",
            1: "Only one rating!",
            other: "{} ratings."
        };

        //vm.tasks = { a: { name: "AAA name" }, b: {name: "BBB name"} }; //StorageService.getTasks();
        vm.tasks = function() {
            StorageService.loadTasks();
            var ts =  StorageService.getTasks();
            return ts;
        }();

    }]);

})();
