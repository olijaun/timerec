(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('ReportCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {
        var vm = this;
        vm.selectedDate = new Date();

        vm.report = [];

        vm.generateReport = function() {
            console.log('reporting now');
            var reportDate = vm.selectedDate;

            var records = StorageService.getRecords(reportDate.getFullYear(), reportDate.getMonth() + 1);

            // Hash Map with day as key and a hash map with task and summed time as value.
            //{ 1 :  { taskId : 'value', taskId2 : 'value2' }, 2 : { taskId : 'value', taskId2 : 'value2' } };
            var dayMap = {};

            var previousDay = null; // int
            var previousTask = null; // string
            var previousDate = null; // date
        //
            for (var i = records.length - 1; i >= 0; i--) {
                var record = records[i];

                var task = record.taskId;
                var day = record.day;
                var hour = record.hour;
                var minute = record.minute;

                var recordDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), day, hour, minute);

                if (previousDay != null && day === previousDay) {

                    var durationInSecs = (recordDate.getTime() - previousDate.getTime()) / 1000;
                    var durationInHours = durationInSecs / 60. / 60.;

                    // { taskId : 'value', taskId2 : 'value2' }
                    var taskMap = null;

                    if (dayMap[day] !== undefined) { // contains key
                        taskMap = dayMap[day];
                   } else {
                        taskMap = {};
                        dayMap[day] = taskMap;
                    }

                    if ("stop" !== previousTask) {
                        if (taskMap[previousTask] !== undefined) {
                            taskMap[previousTask] = taskMap[previousTask] + durationInHours;
                        } else {
                            taskMap[previousTask] = durationInHours;
                        }
                    }
                } else if (previousDay !== null && previousDay > day) {
                    throw "invalid format. time records have to be in order";
                }

                previousDay = day;
                previousTask = task;
                previousDate = recordDate;
            }

            // one entry per day, each entry consists of an array
            // [ { day: 1, totalDuration: 8, taskSummary: [ { taskId: 'task1', duration: 7 }, ... ] }, ...]
            var r = [];

            for(var dayKey in dayMap) {

                var dayEntry = dayMap[dayKey];
                var daySummary = { day: dayKey, totalDuration: 0, taskSummary: [] };
                //console.log("=== Day " + dayKey + "\n");
                var taskMap = dayEntry;
                var timeSum = 0.;

                for (var taskEntryKey in taskMap) {

                    var taskEntry = taskMap[taskEntryKey];

                    console.log(taskEntryKey + ", " + taskEntry);

                    var taskSummary = { taskId: taskEntryKey, duration: taskEntry };

                    daySummary.taskSummary.push(taskSummary);
                    daySummary.totalDuration += taskEntry;
                }

                r.push(daySummary);
            }
            vm.report = r;
        };

    }]);
})();
