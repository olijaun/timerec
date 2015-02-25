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

    function init() {

        taskDropdownMenu = $("#task-dropdown-menu");
        tableBody = $('#taskTable tbody')[0];

        monthInput = $('#month-input').combobox();
        monthInput = $('#task-input').combobox();
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
        var now = new Date();

        yearInputField.val(now.getFullYear());
        dayInputField.val(now.getDate());
        monthInput.val(now.getMonth());

        var timeStr = now.getHours() + ":" + now.getMinutes();

        timePicker.timepicker('setTime', timeStr);

        TimerecModel.loadMonthData(now.getFullYear(), now.getDate());

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
            //var button = $(event.relatedTarget) // Button that triggered the modal
            //var recipient = button.data('whatever') // Extract info from data-* attributes
            //// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            //// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            //var modal = $(this)
            //modal.find('.modal-title').text('New message to ' + recipient)
            //modal.find('.modal-body input').val(recipient)

            //timePicker = $('#timepicker1').timepicker({
            //    minuteStep: 1,
            //    template: 'dropdown',
            //    appendWidgetTo: 'body',
            //    showSeconds: false,
            //    showMeridian: false,
            //    defaultTime: false,
            //    showInputs: false
            //});
        });

        yearInputField.blur(displayMonth);

        monthInput.change(displayMonth);


        $('body').on('click','.tp',function (event) {
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

            var taskId = event.currentTarget.attributes.id.value;

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

            console.log("hour: " + hour);
            console.log("minute: " + minute);
            console.log("month: " + month);
            console.log("year: " + year);
            TimerecModel.loadMonthData(year, month);
            TimerecModel.addTaskRecord(taskId, day, hour, minute);
            TimerecModel.storeMonthData();
            var data = TimerecModel.getData();
            renderTable(data);
        });
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



            cell1.innerHTML = '<a data-toggle="modal" data-target="#modalEdit" data-whatever="@mdo" data-title="Login" data-container="body" type="button" data-html="true" href="#" id="login">' + rec.day + '</a>';
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
    }

    return {
        init: init,
        renderTasks: renderTasks,
        renderTable: renderTable
    };
})();