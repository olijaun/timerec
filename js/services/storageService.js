(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.factory('StorageService', function () {

        return (function () {

            var defaultTasks = {
                taskA: {name: "My Task 1", selectable: true},
                taskB: {name: "My Task 2", selectable: true},
                taskC: {name: "My Task 3", selectable: true},
                taskD: {name: "Old Task", selectable: false}
            };

            function getRecords(year, month) {
                var storageItemName = getStorageItemNameForRecords(year, month);
                var records;
                if (localStorage.getItem(storageItemName) === null || localStorage.getItem(storageItemName) === undefined) {
                   records = [];
                } else {
                    var storedDataString = localStorage.getItem(storageItemName);
                    records = JSON.parse(storedDataString);
                }
                return records;
            }

            function getTasks() {

                var storageItemName = getStorageItemNameForTasks();
                var tasks;

                if (localStorage.getItem(storageItemName) === null || localStorage.getItem(storageItemName) === undefined) {
                    tasks = defaultTasks;
                } else {
                    var storedDataString = localStorage.getItem(storageItemName);
                    tasks = JSON.parse(storedDataString);
                }

                return tasks;
            }

            function storeRecords(year, month, records) {

                if (year === undefined || month === undefined || records === undefined) {
                    return;
                }

                records.sort(sortRecordsByDay);
                var storageItemName = getStorageItemNameForRecords(year, month);
                var dataString = JSON.stringify(records);
                localStorage.setItem(storageItemName, dataString);
            }

            function storeTasks(tasks) {

                if (tasks === undefined) {
                    return;
                }

                var storageItemName = getStorageItemNameForTasks();
                var dataString = JSON.stringify(tasks);
                localStorage.setItem(storageItemName, dataString);
            }

            function sortRecordsByDay(taskA, taskB) {
                if (taskA.day === taskB.day) {
                    return (taskA.hour * 100 + taskA.minute) - (taskB.hour * 100 + taskB.minute);
                }
                return taskA.day - taskB.day;
            }

            function getStorageItemNameForRecords(year, month) {
                var y = '' + year;
                var m = '' + month;
                if (y.length === 1) {
                    y += '0' + year;
                }
                if (m.length === 1) {
                    m = '0' + month;
                }

                return 'timerec.records.' + y + '.' + m;
            }

            function getStorageItemNameForTasks() {
                return 'timerec.tasks';
            }

            return {
                theNumber: 37,
                getTasks: getTasks,
                getRecords: getRecords,
                storeRecords: storeRecords,
                storeTasks: storeTasks
            };
        })();
    });
})();
