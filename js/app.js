
var selectedMonth;
var selectedYear;

var recordedTasks = { records: [] };

window.onload = function() {
    'use strict';

    console.log('Registering handler ...');
    var addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', addRecord);

    $('#timepicker1').timepicker();

    $('#datepicker').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });


    var storageSupport = supports_html5_storage();

    var taskConfiguration;

    if(storageSupport) {
        if(localStorage.taskConfiguration === null) {

            var tasks = {
                taskConfiguration: [
                    {id: "taskA", name: "Task A"},
                    {id: "taskB", name: "Task B"}
                ]
            };

            var serializedTasks = JSON.stringify(tasks);
            console.log(serializedTasks);
            localStorage.taskConfiguration = JSON.stringify(serializedTasks);
        }

        var taskString = localStorage.taskConfiguration;
        taskConfiguration = JSON.parse(taskString);
    }

    var taskList = taskConfiguration.taskConfiguration;

    for (var index = 0; index < taskList.length; index++) {
        var task = taskList[index];
        $("#task").append("<option value='" + task.id + "'>" + task.name + "</option>");
        console.log(taskList[index]);
    }
};

function loadMonth() {

}

function addRecord() {
    'use strict';

    var dayVal = $("#datepicker").datepicker('getDate').getDate();
    var timeVal = "" + $("#timepicker1").val();
    var idVal = $("#task").val();

    recordedTasks.records.push({ taskId: idVal, day: dayVal, time: timeVal});

    updateTable(recordedTasks);

}

function updateTable(list) {
    var table = $('#taskTable')[0];

    //$("#taskTable tbody tr").remove();

    while(table.rows.length > 0) {
        table.deleteRow(0);
    }

    var records = recordedTasks.records;

    for (var index = 0; index < records.length; index++) {
        console.log(records.length);
        var rec = records[index];
        //$("#task").append("<option value='" + task.id + "'>" + task.name + "</option>");
        //console.log(taskList[index]);

        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = rec.day;
        cell2.innerHTML = rec.time;
        cell3.innerHTML = rec.taskId;
    }
}

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
        return false;
    }
}