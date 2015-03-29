'use strict';
(function () {

    angular.module('timerecApp').factory('StorageService', function () {
        return (function () {

            var defaultTasks = {
                taskA: {name: 'My Task 1', selectable: true},
                taskB: {name: 'My Task 2', selectable: true},
                taskC: {name: 'My Task 3', selectable: true},
                taskD: {name: 'Old Task', selectable: false}
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

                records.sort(sortRecordsByDay);

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

                for(var i = 0; i < records.length; i++) {
                    var r = records[i];
                    if(!r.day) {
                        throw "Day must be set";
                    }
                    r.day = parseInt(r.day);
                    if(isNaN(r.day)) {
                        throw "Invalid value for day";
                    }
                    if(!r.taskId) {
                        throw "You must select a task";
                    }
                    if(!getTasks()[r.taskId]) {
                        throw "The selected task is not defined";
                    }
                    if(r.hour !== 0 && !r.hour) {
                        throw "Hours must be specified";
                    }
                    r.hour = parseInt(r.hour);
                    if(isNaN(r.hour)) {
                        throw "Invalid hour specified";
                    }
                    if(r.minute !== 0 && !r.minute) {
                        throw "Minutes must be specified";
                    }
                    r.minute = parseInt(r.minute);
                    if(isNaN(r.minute)) {
                        throw "Invalid minute specified";
                    }
                    if(!isValidDate(parseInt(year), parseInt(month), r.day)) {
                        throw "You specified an invalid date";
                    }
                }

                records.sort(sortRecordsByDay);
                var storageItemName = getStorageItemNameForRecords(year, month);
                var dataString = JSON.stringify(records);
                localStorage.setItem(storageItemName, dataString);

                console.log('stored records');
            }

            function isValidDate(year, month, day) {
                var d = new Date(year, month - 1, day);
                return d && (d.getMonth() + 1) === month && d.getDate() === day;
            }

            function storeTasks(tasks) {

                if (tasks === undefined) {
                    return;
                }

                for(var taskKey in tasks) {
                    if(tasks.hasOwnProperty(taskKey)) {

                        if(taskKey === "null" || taskKey === null || taskKey === undefined) {
                            throw "A task id must be specified";
                        }

                        var task = tasks[taskKey];

                        if (!task.name) {
                            throw "A task name must be specified";
                        }
                        if (task.selectable === null || task.selectable === undefined) {
                            throw "You must specify whether this task is selectable or not.";
                        }
                    }
                }

                var storageItemName = getStorageItemNameForTasks();
                var dataString = JSON.stringify(tasks);
                localStorage.setItem(storageItemName, dataString);
            }

            function sortRecordsByDay(taskA, taskB) {
                if (parseInt(taskA.day) === parseInt(taskB.day)) {
                    return -1 * ((parseInt(taskA.hour) * 100 + parseInt(taskA.minute)) - (parseInt(taskB.hour) * 100 + parseInt(taskB.minute)));
                }
                return -1 * (parseInt(taskA.day) - parseInt(taskB.day));
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
                getTasks: getTasks,
                getRecords: getRecords,
                storeRecords: storeRecords,
                storeTasks: storeTasks
            };
        })();
    });
})();
