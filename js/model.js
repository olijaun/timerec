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

        var dt = {
            taskA: "taskA",
            taskB: "taskB"
        };

        for (var property in dt) {
            if (dt.hasOwnProperty(property)) {
                //console.log(property);
                console.log('---> ' + dt[property]);
            }
        }
        //cosole.log(dt[property]);

        //var map = new Map();

        return defaultTasks;
    }

    function getTaskRecords(year, month) {
        loadMonthData(year, month);
    }

    function addTaskRecord(taskId, day, hour, minute) {

        currentData.records.sort(sortTasksByDay);

        currentData.records.push({taskId: taskId, day: day, hour: hour, minute: minute});
    }

    function sortTasksByDay(taskA, taskB) {
        return taskA.day - taskB.day;
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

        currentData.records.sort(sortTasksByDay);

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