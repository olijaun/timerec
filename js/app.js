
window.onload = function() {
    'use strict';

    TimerecModel.init();
    TimerecView.init();

    var taskList = TimerecModel.getTasks();

    TimerecView.renderTasks(taskList);

    var now = new Date();

    TimerecModel.loadMonthData(now.getFullYear(), now.getMonth());
    var data = TimerecModel.getData();

    TimerecView.renderTable(data);
};