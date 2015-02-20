var TimerecView  = (function () {

    var tableBody;
    var taskDropdownMenu;
    var controller;

    function init() {

        taskDropdownMenu = $("#task-dropdown-menu");
        tableBody = $('#taskTable tbody')[0];

        taskDropdownMenu.on('click', 'li', function (event) {

            var taskId = event.currentTarget.attributes.id.value;

            var now = new Date();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            var year = now.getFullYear();
            var month = now.getMonth();

            TimerecModel.loadMonthData(year, month);
            TimerecModel.addTaskRecord(taskId, day, hour, minute);
            TimerecModel.storeMonthData();
            var data = TimerecModel.getData();
            renderTable(data);
        });
    }

    function renderTable(data) {
        //$("#taskTable tbody tr").remove();

        while(tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }

        var records = data.records;

        var now = new Date();

        for (var index = records.length - 1; index >= 0; index--) {
            console.log(records.length);
            var rec = records[index];

            if(rec.day !== now.getDate()) {
                break;
            }

            //$("#task").append("<option value='" + task.id + "'>" + task.name + "</option>");
            //console.log(taskList[index]);

            var row = tableBody.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = rec.day;
            cell2.innerHTML = toTimeStr(rec.hour, rec.minute);
            cell3.innerHTML = TimerecModel.getTasks()[rec.taskId].name;
        }
    }

    function toTimeStr(hour, minute) {
        var timeStr = '';

        if(hour < 10) {
            timeStr += '0' + hour;
        } else {
            timeStr += '' + hour;
        }

        timeStr += ':';

        if(minute < 10) {
            timeStr += '0' + minute;
        } else {
            timeStr += '' + minute;
        }
        return timeStr;
    }

    function renderTasks(tasks) {

        console.log(taskDropdownMenu);

        for (var property in tasks) {
            if (tasks.hasOwnProperty(property)) {
                var task = tasks[property];
                if(task.selectable) {
                    taskDropdownMenu.append("<li id='" + property + "'>" + task.name + "</li>");
                }
            }
        }
    }

    return {
        init: init,
        renderTasks: renderTasks,
        renderTable: renderTable
    };
})();