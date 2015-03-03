var TimerecModel = (function () {
    'use strict';

    var currentData;
    var tasks;

    function init() {
        loadTasks();
        currentData = {year: undefined, month: undefined, records: []};
    }

    function getData() {
        return currentData;
    }

    function getTasks() {
        return tasks;
    }

    function getTaskRecords(year, month) {
        loadMonthData(year, month);
    }

    function addTaskRecord(taskId, day, hour, minute) {
        currentData.records.sort(sortTasksByDay);
        currentData.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
    }

    function removeTaskRecord(index) {
        currentData.records.splice(index, 1);
    }

    function sortTasksByDay(taskA, taskB) {
        if(taskA.day === taskB.day) {
            return (taskA.hour * 100 + taskA.minute) - (taskB.hour * 100 + taskB.minute);
        }
        return taskA.day - taskB.day;
    }

    function loadMonthData(year, month) {

        var storageItemName = getStorageItemNameForRecords(year, month);

        if (localStorage.getItem(storageItemName) === null || localStorage.getItem(storageItemName) === undefined) {

            var newdata = {year: year, month: month, records: []};
            currentData =  newdata;

        } else {

            var storedDataString = localStorage.getItem(storageItemName);
            currentData = JSON.parse(storedDataString);
        }
    }

    function loadTasks() {

        var storageItemName = getStorageItemNameForTasks();

        if (localStorage.getItem(storageItemName) === null || localStorage.getItem(storageItemName) === undefined) {

            var defaultTasks = {
                taskA: { name: "My Task 1", selectable: true },
                taskB: { name: "My Task 2", selectable: true },
                taskC: { name: "My Task 3", selectable: true },
                taskD: { name: "Old Task", selectable: false }
            };

            tasks =  defaultTasks;

        } else {

            var storedDataString = localStorage.getItem(storageItemName);
            tasks = JSON.parse(storedDataString);
        }
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

    function storeMonthData() {

        if(currentData.year === undefined || currentData.month === undefined) {
            return;
        }

        currentData.records.sort(sortTasksByDay);
        var storageItemName = getStorageItemNameForRecords(currentData.year, currentData.month);
        var dataString = JSON.stringify(currentData);
        localStorage.setItem(storageItemName, dataString);
    }

    function storeTasks() {

        if(tasks === undefined) {
            return;
        }

        var storageItemName = getStorageItemNameForTasks();
        var dataString = JSON.stringify(tasks);
        localStorage.setItem(storageItemName, dataString);
    }

    return {
        init: init,
        getTasks: getTasks,
        getData: getData,
        loadMonthData: loadMonthData,
        addTaskRecord: addTaskRecord,
        removeTaskRecord: removeTaskRecord,
        getTaskRecords: loadMonthData,
        storeMonthData: storeMonthData,
        loadTasks: loadTasks,
        storeTasks: storeTasks
    };
})();