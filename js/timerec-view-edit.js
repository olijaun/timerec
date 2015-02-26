var TimerecViewEdit = (function () {

    var tableBody;
    var taskDropdownMenu;
    var controller;
    var monthInput;
    var yearInputField;
    var monthInputField;
    var dayInputField;
    //var timeInputField;
    var timePicker;
    var taskCombo;
    var taskEditCombo;
    var saveButton;
    var saveNewButton;
    var editRecordIndex;

    function init() {

        editRecordIndex = -1;
        taskDropdownMenu = $("#task-dropdown-menu");
        tableBody = $('#taskTable tbody')[0];

        // check out http://silviomoreto.github.io/bootstrap-select/
        monthInput = $('#month-input').combobox();

        taskCombo = $('#task-input').combobox();
        yearInputField = $('#year-input');
        dayInputField = $('#day-input');
        timePicker = $('#timepicker1').timepicker({
            minuteStep: 1,
            template: 'dropdown',
            //appendWidgetTo: 'body',
            showSeconds: false,
            showMeridian: false,
            defaultTime: false,
            showInputs: true,
            modalBackdrop: true
        });
        taskEditCombo = $('#task-select').combobox();
        saveButton = $('#saveButton');
        saveNewButton = $('#saveNewButton');

        var now = new Date();

        yearInputField.val(now.getFullYear());
        dayInputField.val(now.getDate());
        //monthInput.val(now.getMonth());
        //monthInput.val(1);
        monthInput.val(now.getMonth() + 1);
        monthInput.data('combobox').refresh();
        var timeStr = now.getHours() + ":" + now.getMinutes();

        timePicker.timepicker('setTime', timeStr);

        TimerecModel.loadMonthData(now.getFullYear(), now.getMonth() + 1);
        var data = TimerecModel.getData();
        renderTable(data);

        var displayMonth = (function () {

            var timePickerTime = timePicker.val();
            if (timePickerTime === undefined) {
                return;
            }
            var datetimeTmp = timePickerTime.split(':');

            var year = parseInt(yearInputField.val());
            if (isNaN(year)) {
                // TODO: error handling
                //$('task-button').prop('disabled', true);
                disableButtons();
                return;
            }
            var month = parseInt(monthInput.val());
            if (isNaN(month)) {
                // TODO:
                disableButtons();
                return;
            }

            TimerecModel.loadMonthData(year, month);
            var data = TimerecModel.getData();
            renderTable(data);

            var day = parseInt(dayInputField.val());
            if (isNaN(day)) {
                disableButtons();
                return;
            }
            var hour = parseInt(datetimeTmp[0]);
            if (isNaN(hour)) {
                disableButtons();
                return;
            }
            var minute = parseInt(datetimeTmp[1]);
            if (isNaN((minute))) {
                disableButtons();
                return;
            }

            enableButtons();
        });

        $('#modalEdit').on('show.bs.modal', function (event) {

            var link = $(event.relatedTarget) // element that triggered the modal

            editRecordIndex = link.data('recordIndex') // Extract info from data-* attributes
            //// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            //// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            //var modal = $(this)
            //modal.find('.modal-title').text('New message to ' + recipient)
            //modal.find('.modal-body input').val(recipient)
            //var button = $(event.relatedTarget) // Button that triggered the modal
            console.log('index:::::::: ' + editRecordIndex);

            var selectedData = TimerecModel.getData().records[editRecordIndex];
            dayInputField.val(selectedData.day);

            var timeStr = '';
            if(selectedData.hour < 10) {
                timeStr = '0' + selectedData.hour;
            } else{
                timeStr += selectedData.hour
            }
            timeStr += ":";

            if(selectedData.minute < 10) {
                timeStr += '0' + selectedData.minute;
            } else{
                timeStr += selectedData.minute
            }

            timePicker.val(timeStr);

            taskEditCombo.val(selectedData.taskId);
            taskEditCombo.data('combobox').refresh();
        });

        yearInputField.blur(displayMonth);

        monthInput.change(displayMonth);

        $('body').on('click', '.tp', function (event) {
            timePicker = $('.tp').timepicker({
                minuteStep: 1,
                template: 'dropdown',
                appendWidgetTo: 'body',
                showSeconds: false,
                showMeridian: false,
                defaultTime: false,
                showInputs: false
            });
        });

        taskDropdownMenu.on('click', 'li', function (event) {

            var now = new Date();

            var taskId = event.currentTarget.attributes.id.value;
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            TimerecModel.loadMonthData(year, month);
            TimerecModel.addTaskRecord(taskId, day, hour, minute);
            TimerecModel.storeMonthData();
            var data = TimerecModel.getData();
            renderTable(data);
        });

        var saveFunction = function (event) {

            console.log('save...');

            var timePickerTime = timePicker.val();
            if (timePickerTime === undefined) {
                return;
            }
            var datetimeTmp = timePickerTime.split(':');

            var year = parseInt(yearInputField.val());
            if (isNaN(year)) {
                // TODO: error handling
                return;
            }
            var month = parseInt(monthInput.val());
            if (isNaN(month)) {
                // TODO:
                return;
            }

            var day = parseInt(dayInputField.val());
            if (isNaN(day)) {
                // TODO: error handling
                return;
            }
            var hour = parseInt(datetimeTmp[0]);
            if (isNaN(hour)) {
                // TODO: error handling
                return;
            }
            var minute = parseInt(datetimeTmp[1]);
            if (isNaN((minute))) {
                // TODO:
                return;
            }

            var selectedTaskId = $("#task-select option:selected").val();

            console.log("hour: " + hour);
            console.log("minute: " + minute);
            console.log("month: " + month);
            console.log("year: " + year);
            TimerecModel.loadMonthData(year, month);

            var data = TimerecModel.getData();

            if(event.target.id === 'saveButton') {
                var modifiedRecord = data.records[editRecordIndex];
                modifiedRecord.taskId = selectedTaskId;
                modifiedRecord.day = day;
                modifiedRecord.hour = hour;
                modifiedRecord.minute = minute;
                TimerecModel.storeMonthData();
            } else if(event.target.id === 'saveNewButton') {
                TimerecModel.addTaskRecord(selectedTaskId, day, hour, minute);
                TimerecModel.storeMonthData();
            }
            data = TimerecModel.getData();

            renderTable(data);
        };

        saveButton.click(saveFunction);
        saveNewButton.click(saveFunction);
    }

    function disableButtons() {
        $('.dropdown-toggle').prop('disabled', true);
        $('#stop-button').prop('disabled', true);

        //$('#stop-button').addClass('disabled');
    }

    function enableButtons() {
        $('.dropdown-toggle').prop('disabled', false);
        $('#stop-button').prop('disabled', false);

        //$('#stop-button').removeClass('disabled');
    }

    function deleteAllTableRows() {
        while (tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }
    }

    function renderTable(data) {
        //$("#taskTable tbody tr").remove();
        console.log('render table');
        while (tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }

        var records = data.records;

        var now = new Date();

        for (var index = records.length - 1; index >= 0; index--) {
            console.log(records.length);
            var rec = records[index];

            //$("#task").append("<option value='" + task.id + "'>" + task.name + "</option>");
            //console.log(taskList[index]);

            var row = tableBody.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);

            cell1.innerHTML = '<a data-toggle="modal" data-target="#modalEdit" data-record-index="' + index + '" data-title="Login" data-container="body" type="button" data-html="true" href="#" id="login">' + rec.day + '</a>';
            //cell1.innerHTML = '<a data-placement="bottom" data-toggle="popover" data-title="Login" data-container="body" type="button" data-html="true" href="#" id="login">' + rec.day + '</a>';
            cell2.innerHTML = toTimeStr(rec.hour, rec.minute);
            cell3.innerHTML = TimerecModel.getTasks()[rec.taskId].name + "&nbsp;<span id='deleteItem" + index + "' class='glyphicon glyphicon-remove'></span>";
            $('#deleteItem' + index).click((function (removeIndex) {
                return function () {
                    $('#deleteItem' + index).unbind();
                    removeRecord(removeIndex);

                };
            })(index));
        }
    }

    function removeRecord(index) {
        console.log('delete record ' + index);
        TimerecModel.removeTaskRecord(index);
        TimerecModel.storeMonthData();
        var data = TimerecModel.getData();
        renderTable(data);
    }

    function toTimeStr(hour, minute) {
        var timeStr = '';

        if (hour < 10) {
            timeStr += '0' + hour;
        } else {
            timeStr += '' + hour;
        }

        timeStr += ':';

        if (minute < 10) {
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
                if (task.selectable) {
                    taskDropdownMenu.append("<li id='" + property + "'>" + task.name + "</li>");
                }
            }
        }

        for (var property in tasks) {
            if (tasks.hasOwnProperty(property)) {
                var task = tasks[property];
                if (task.selectable) {
                    taskEditCombo.append("<option value='" + property + "'>" + task.name + "</li>");
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