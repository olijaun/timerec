var TimerecView  = (function () {

    var taskDropdownMenu;
    var controller

    function init() {

        taskDropdownMenu = $("#task-dropdown-menu");

        taskDropdownMenu.on('click', 'li', function (event) {

            var taskId = event.currentTarget.attributes.id.nodeValue;

            var now = new Date();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            var year = now.getFullYear();
            var month = now.getMonth();

            TimerecModel.loadMonthData(year, month)
            TimerecModel.addTaskRecord(taskId, day, hour, minute);
            TimerecModel.storeMonthData();
        });
    }

    function renderTasks(taskList) {

        console.log(taskDropdownMenu);

        for (var index = 0; index < taskList.length; index++) {
            var task = taskList[index];
            taskDropdownMenu.append("<li id='" + task.id + "'>" + task.name + "</li>");
            console.log(taskList[index]);
        }
    }

    return {
        init: init,
        renderTasks: renderTasks
    }
})();