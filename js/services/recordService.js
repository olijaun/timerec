(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.factory('RecordService', ['StorageService', function (StorageService) {

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var records;
        load(year, month);

        function load(year, month) {
            records = StorageService.getRecords(year, month);
        }

        function store() {
            StorageService.storeRecords(records);
        }

        return {
            month: month,
            year: year,
            load: load,
            store: store,
            records: records
        };
    }]);
})();

