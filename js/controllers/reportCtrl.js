(function () {

    var timerecApp = angular.module("timerecApp");

    timerecApp.controller('ReportCtrl', ['StorageService', '$scope', '$modal', function (StorageService, $scope, $modal) {
        var vm = this;

        vm.report = [{
            day: 1,
            summary: [{taskId: 'task1', hours: 8}, {taskId: 'task7', hours: 6}, {taskId: 'task8', hours: 3}]
        },
            {day: 2, summary: [{taskId: 'task1', hours: 8}, {taskId: 'task7', hours: 6}, {taskId: 'task8', hours: 3}]}];


        var now = new Date();

        vm.month = now.getMonth() + 1;
        vm.year = now.getFullYear();

        vm.calculateReport = function () {

            var records = StorageService.getRecords(vm.year, vm.month);

            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                console.log(record.taskId + ", " + record.day + ", " + record.hour + ", " + record.minute);
            }

            // Hash Map with day as key and a hash map with task and summed time as value.
            //{ 1 :  { taskId : 'value', taskId2 : 'value2' }, 2 : { taskId : 'value', taskId2 : 'value2' } };
            var dayMap = {};

            var previousDay = null; // int
            var previousTask = null; // string
            var previousDate = null; // date
        //
            for (var i = 0; i < records.length; i++) {
                var record = records[i];

                var task = record.task;
                var day = record.day;
                var hour = record.hour;
                var minute = record.minute;

                var recordDate = new Date(vm.year, vm.month - 1, day, hour, minute);

                if (previousDay != null && day === previousDay) {

                    var durationInSecs = (recordDate.getTime() - previousDate.getTime()) / 1000;
                    var durationInHours = durationInSecs / 60. / 60.;

        //            LinkedHashMap<String, Double> taskMap = null;
                    // { taskId : 'value', taskId2 : 'value2' }
                    var taskMap = {};

                    if (dayMap[day] !== undefined) { // does not contain key yet
        //                taskMap = dayMap.get(day);
        //            } else {
        //                taskMap = new LinkedHashMap<String, Double>();
        //                dayMap.put(day, taskMap);
        //            }
        //
        //            if (!"stop".equals(previousTask)) {
        //                if (taskMap.containsKey(previousTask)) {
        //                    taskMap.put(previousTask, taskMap.get(previousTask) + durationInHours);
        //                } else {
        //                    taskMap.put(previousTask, durationInHours);
        //                }
        //            }
        //        } else if (previousDay != null && previousDay > day) {
        //            throw new RuntimeException("invalid format. time records have to be in order");
        //        }
        //
        //        previousDay = day;
        //        previousTask = task;
        //        previousDate = date;
        //    }
        //
        //    Set<Entry<Integer, LinkedHashMap<String, Double>>> dayEntrySet = dayMap.entrySet();
        //
        //    StringBuilder report = new StringBuilder();
        //
        //    for (Entry<Integer, LinkedHashMap<String, Double>> dayEntry : dayEntrySet) {
        //
        //        report.append("=== Day " + dayEntry.getKey() + "\n");
        //
        //        HashMap<String, Double> taskMap = dayEntry.getValue();
        //        Set<Entry<String, Double>> taskEntrySet = taskMap.entrySet();
        //
        //        List<String> reportLines = new ArrayList<String>();
        //        double timeSum = 0.;
        //
        //        for (Entry<String, Double> taskEntry : taskEntrySet) {
        //            reportLines.add(String.format("%-20s %-60s %.2f", taskEntry.getKey(), Aze.this.taskMap.get(taskEntry.getKey())
        //                .getDesc(), taskEntry.getValue()));
        //            timeSum += taskEntry.getValue();
        //        }
        //        Collections.sort(reportLines, ALPHABETICAL_ORDER);
        //
        //        for (String reportLine : reportLines) {
        //            report.append(reportLine + "\n");
        //        }
        //        report.append(String.format(String.format("%-20s %-55s Sum: %.2f\n\n", "", "", timeSum)));
        //    }
        //
        //    return report.toString();
        //
        //} catch (Exception e) {
        //    throw new AzeException(e.getMessage());
        //}


        }();
    }]);
})();
