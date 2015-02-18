var TimerecModel = (function () {
    'use strict';

    var currentData;

    function init() {
        currentData = {year: undefined, month: undefined, records: []};
    }

    function getData() {
        return currentData;
    }

    function getTasks() {
        var defaultTasks = [
            {id: "taskA", name: "Task A"},
            {id: "taskB", name: "Task B"}
        ];

        return defaultTasks;
    }

    function getTaskRecords(year, month) {
        loadMonthData(year, month);
    }

    function addTaskRecord(taskId, day, hour, minute) {

        currentData.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
    }

    function loadMonthData(year, month) {

        var storageItemName = getStorageItemName(year, month);

        if (localStorage.getItem(storageItemName) === null || localStorage.getItem(storageItemName) === undefined) {

            var newdata = {year: year, month: month, records: []};
            currentData =  newdata;

        } else {

            var storedDataString = localStorage.getItem(storageItemName);
            currentData = JSON.parse(storedDataString);
        }
    }

    function getStorageItemName(year, month) {
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

    function storeMonthData() {

        if(currentData.year === undefined || currentData.month === undefined) {
            return;
        }

        var storageItemName = getStorageItemName(currentData.year, currentData.month);

        var dataString = JSON.stringify(currentData);

        localStorage.setItem(storageItemName, dataString);
    }

    return {
        init: init,
        getTasks: getTasks,
        getData: getData,
        loadMonthData: loadMonthData,
        addTaskRecord: addTaskRecord,
        getTaskRecords: loadMonthData,
        storeMonthData: storeMonthData
    };
})();