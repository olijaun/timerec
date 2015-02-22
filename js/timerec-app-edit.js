
window.onload = function() {
    'use strict';

    TimerecModel.init();
    TimerecViewEdit.init();

    var taskList = TimerecModel.getTasks();

    TimerecViewEdit.renderTasks(taskList);

    var now = new Date();

    TimerecModel.loadMonthData(now.getFullYear(), now.getMonth());
    var data = TimerecModel.getData();

    TimerecViewEdit.renderTable(data);

    TimerecModel.storeTasks();
};