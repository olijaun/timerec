
window.onload = function() {
    'use strict';

    TimerecModel.init();
    TimerecView.init();

    var taskList = TimerecModel.getTasks();

    TimerecView.renderTasks(taskList);
}