"use strict";!function(){angular.module("timerecApp",["ui.bootstrap","ui.router"])}(),function(){angular.module("timerecApp").config(["$stateProvider","$urlRouterProvider",function(e,t){t.otherwise("/records"),e.state("records",{url:"/records",templateUrl:"app/records/records.html",controller:"RecordsCtrl as vm"}).state("report",{url:"/report",templateUrl:"app/report/report.html",controller:"ReportCtrl as vm"}).state("tasks",{url:"/tasks",templateUrl:"app/tasks/tasks.html",controller:"TasksCtrl as vm"})}])}(),function(){angular.module("timerecApp").filter("prependZeroFilter",function(){return function(e){var t=""+e;return 1===t.length?"0"+t:t}})}(),function(){angular.module("timerecApp").filter("invisibleTaskFilter",function(){return function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&e[n].selectable&&(t[n]=e[n]);return t}})}(),function(){angular.module("timerecApp").directive("monthSelection",function(){return{restrict:"E",templateUrl:"app/common/month-selection.html",require:"ngModel",replace:!0,link:function(e,t,n,a){e.monthOptions=[{name:"January",id:1},{name:"February",id:2},{name:"March",id:3},{name:"April",id:4},{name:"May",id:5},{name:"June",id:6},{name:"July",id:7},{name:"August",id:8},{name:"September",id:9},{name:"October",id:10},{name:"November",id:11},{name:"December",id:12}],a.$formatters.push(function(t){return{year:t.getFullYear(),month:e.monthOptions[t.getMonth()]}}),a.$parsers.push(function(e){var t=e.year,n=e.month.id;return new Date(t,n-1,1)}),e.updateDate=function(){console.log("change....")},e.$watch("year + month.id",function(){a.$setViewValue({year:e.year,month:e.month})}),a.$viewChangeListeners.push(function(){}),a.$render=function(){var t=new Date;a.$viewValue||(a.$viewValue={year:t.getFullYear(),month:e.monthOptions[t.getMonth()]}),e.year=a.$viewValue.year,e.month=a.$viewValue.month}}}})}(),function(){angular.module("timerecApp").factory("StorageService",function(){return function(){function e(e,t){var n,a=o(e,t);if(null===localStorage.getItem(a)||void 0===localStorage.getItem(a))n=[];else{var r=localStorage.getItem(a);n=JSON.parse(r)}return n.sort(s),n}function t(){var e,t=l();if(null===localStorage.getItem(t)||void 0===localStorage.getItem(t))e=d;else{var n=localStorage.getItem(t);e=JSON.parse(n)}return e}function n(e,n,r){if(void 0!==e&&void 0!==n&&void 0!==r){for(var l=0;l<r.length;l++){var d=r[l];if(!d.day)throw"Day must be set";if(d.day=parseInt(d.day),isNaN(d.day))throw"Invalid value for day";if(!d.taskId)throw"You must select a task";if(!t()[d.taskId])throw"The selected task is not defined";if(0!==d.hour&&!d.hour)throw"Hours must be specified";if(d.hour=parseInt(d.hour),isNaN(d.hour))throw"Invalid hour specified";if(0!==d.minute&&!d.minute)throw"Minutes must be specified";if(d.minute=parseInt(d.minute),isNaN(d.minute))throw"Invalid minute specified";if(!a(parseInt(e),parseInt(n),d.day))throw"You specified an invalid date"}r.sort(s);var i=o(e,n),c=JSON.stringify(r);localStorage.setItem(i,c),console.log("stored records")}}function a(e,t,n){var a=new Date(e,t-1,n);return a&&a.getMonth()+1===t&&a.getDate()===n}function r(e){if(void 0!==e){for(var t in e)if(e.hasOwnProperty(t)){if("null"===t||null===t||void 0===t)throw"A task id must be specified";var n=e[t];if(!n.name)throw"A task name must be specified";if(null===n.selectable||void 0===n.selectable)throw"You must specify whether this task is selectable or not."}var a=l(),r=JSON.stringify(e);localStorage.setItem(a,r)}}function s(e,t){return parseInt(e.day)===parseInt(t.day)?-1*(100*parseInt(e.hour)+parseInt(e.minute)-(100*parseInt(t.hour)+parseInt(t.minute))):-1*(parseInt(e.day)-parseInt(t.day))}function o(e,t){var n=""+e,a=""+t;return 1===n.length&&(n+="0"+e),1===a.length&&(a="0"+t),"timerec.records."+n+"."+a}function l(){return"timerec.tasks"}var d={taskA:{name:"My Task 1",selectable:!0},taskB:{name:"My Task 2",selectable:!0},taskC:{name:"My Task 3",selectable:!0},taskD:{name:"Old Task",selectable:!1}};return{getTasks:t,getRecords:e,storeRecords:n,storeTasks:r}}()})}(),function(){angular.module("timerecApp").controller("ModalInstanceCtrl",["$modalInstance","parent","index",function(e,t,n){var a=this;if(a.parent=t,a.index=n,a.editMode=a.index>=0,a.errorMessage=null,a.editMode)a.selectedTask=t.records[a.index].taskId,a.day=t.records[a.index].day,a.startTime=new Date(a.parent.selectedDate.getFullYear(),a.parent.selectedDate.getMonth(),parseInt(a.parent.records[a.index].day),parseInt(a.parent.records[a.index].hour),parseInt(a.parent.records[a.index].minute));else{var r=new Date;a.startTime=new Date(a.parent.selectedDate.getFullYear(),a.parent.selectedDate.getMonth()),r.getFullYear()===a.startTime.getFullYear()&&r.getMonth()===a.startTime.getMonth()&&(a.startTime.setHours(r.getHours()),a.startTime.setMinutes(r.getMinutes()),a.day=(new Date).getDate()),a.selectedTask="stop"}a.save=function(){try{a.parent.updateTask(a.index,a.selectedTask,a.day,a.startTime.getHours(),a.startTime.getMinutes()),e.dismiss("cancel")}catch(t){a.errorMessage=t}},a.add=function(){try{a.parent.addTask(a.selectedTask,a.day,a.startTime.getHours(),a.startTime.getMinutes()),e.dismiss("cancel")}catch(t){a.errorMessage=t}},a.cancel=function(){console.log("selected task: "+a.parent.tasks[a.selectedTask]),e.dismiss("cancel")}}])}(),function(){angular.module("timerecApp").controller("RecordsCtrl",["StorageService","$modal",function(e,t){var n=this;n.selectedDate=new Date,n.day=n.selectedDate.getDate(),n.tasks=function(){var t=e.getTasks();return t.stop={name:"Stop",selectable:!0},t}(),n.records=function(){var t=e.getRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1);return t}(),n.addTask=function(t,a,r,s){try{n.records.push({taskId:t,day:a,hour:r,minute:s}),e.storeRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1,n.records)}finally{n.records=e.getRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1)}},n.updateTask=function(t,a,r,s,o){try{n.records[t]={taskId:a,day:r,hour:s,minute:o},e.storeRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1,n.records)}finally{n.records=e.getRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1)}},n.startTask=function(e){var t=new Date,a=t.getDate(),r=t.getHours(),s=t.getMinutes();n.addTask(e,a,r,s)},n.stopTask=function(){n.startTask("stop")},n.loadData=function(){n.records=e.getRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1)},n.deleteRecord=function(t){n.records.splice(t,1),e.storeRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1,n.records),n.records=e.getRecords(n.selectedDate.getFullYear(),n.selectedDate.getMonth()+1)},n.openEditDialog=function(e){var a=t.open({templateUrl:"app/records/edit-record-modal.html",controller:"ModalInstanceCtrl",controllerAs:"vm",resolve:{parent:function(){return n},index:function(){return e}}});a.result.then(function(e){console.log("result: "+e)},function(){})},n.closeModal=function(){}}])}(),function(){angular.module("timerecApp").controller("ReportCtrl",["StorageService",function(e){var t=this;t.selectedDate=new Date,t.report=[],t.generateReport=function(){console.log("reporting now");for(var n=t.selectedDate,a=e.getRecords(n.getFullYear(),n.getMonth()+1),r={},s=null,o=null,l=null,d=a.length-1;d>=0;d--){var i=a[d],c=i.taskId,u=i.day,m=i.hour,p=i.minute,v=new Date(n.getFullYear(),n.getMonth(),u,m,p);if(null!==s&&u===s){var g=(v.getTime()-l.getTime())/1e3,h=g/60/60,f=null;void 0!==r[u]?f=r[u]:(f={},r[u]=f),"stop"!==o&&(f[o]=void 0!==f[o]?f[o]+h:h)}else if(null!==s&&s>u)throw"invalid format. time records have to be in order";s=u,o=c,l=v}var b=[];for(var k in r)if(r.hasOwnProperty(k)){var y=r[k],T={day:k,totalDuration:0,taskSummary:[]},D=y;for(var M in D)if(D.hasOwnProperty(M)){var I=D[M],w={taskId:M,duration:I};T.taskSummary.push(w),T.totalDuration+=I}b.push(T)}t.report=b}}])}(),function(){angular.module("timerecApp").controller("EditTaskModalInstanceCtrl",["$modalInstance","parent","selectedTaskId",function(e,t,n){var a=this;a.parent=t,a.editMode=null!==n&&void 0!==n,a.editMode?(a.taskId=n,a.taskName=a.parent.tasks[n].name,a.selectable=a.parent.tasks[n].selectable):(a.taskId=null,a.taskName=null,a.selectable=!0),a.save=function(){a.parent.updateTask(a.taskId,a.taskName,a.selectable),e.dismiss("save")},a.add=function(){a.parent.updateTask(a.taskId,a.taskName,a.selectable),e.dismiss("add")},a.cancel=function(){console.log("selected task: "+a.parent.tasks[a.selectedTask]),e.dismiss("cancel")}}])}(),function(){angular.module("timerecApp").controller("TasksCtrl",["StorageService","$modal",function(e,t){var n=this;n.errorMessage=null,n.tasks=function(){var t=e.getTasks();return t.stop={name:"Stop",selectable:!1},t}(),n.openEditDialog=function(e){var a=t.open({templateUrl:"app/tasks/edit-task-modal.html",controller:"EditTaskModalInstanceCtrl",controllerAs:"vm",resolve:{parent:function(){return n},selectedTaskId:function(){return e}}});a.result.then(function(e){console.log("result: "+e)},function(){})},n.addTask=function(t,a,r){try{n.tasks[t]={name:a,selectable:r},e.storeTasks(n.tasks)}catch(s){n.errorMessage=s}finally{n.tasks=e.getTasks()}},n.deleteTask=function(t){delete n.records[t],e.storeTasks(n.tasks),n.tasks=e.getTasks()},n.updateTask=function(e,t,a){n.addTask(e,t,a)},n.closeModal=function(){}}])}(),angular.module("timerecApp").run(["$templateCache",function(e){e.put("app/common/month-selection.html",'<form class="form-horizontal">\n    <div class="form-group">\n\n        <label class="control-label col-sm-2">Year</label>\n\n        <div class="col-sm-4">\n            <input id="year-input" type="number" class="form-control" placeholder="Year"\n                   aria-describedby="basic-addon1" ng-model="year">\n        </div>\n\n        <label class="control-label col-sm-2">Month</label>\n\n        <div class="col-sm-4">\n            <select id="month-input" class="combobox form-control" name="horizontal"\n                    required="required" ng-model="month"\n                    ng-options="o.name for o in monthOptions">\n            </select>\n        </div>\n    </div>\n</form>'),e.put("app/records/edit-record-modal.html",'<div class="modal-header">\n    <h3 class="modal-title">\n        <div ng-hide="vm.editMode">New</div>\n        <div ng-show="vm.editMode">Edit</div>\n    </h3>\n</div>\n<div class="modal-body">\n    <div class="alert alert-danger alert-dismissible" role="alert" ng-show="vm.errorMessage">\n        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span\n                aria-hidden="true">&times;</span></button>\n        {{vm.errorMessage}}\n    </div>\n    <form name="recordForm" class="form-horizontal" novalidate>\n        <div class="form-group">\n            <label class="control-label col-sm-2">Day</label>\n\n            <div class="col-sm-10">\n                <input id="day-input" name="day" type="number" class="form-control" placeholder="Day"\n                       aria-describedby="basic-addon1" value="{{vm.day}}" ng-model="vm.day" required>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="control-label col-sm-2">Time</label>\n\n            <div class="col-sm-10">\n                <timepicker name="startTime" ng-model="vm.startTime" hour-step="1" minute-step="1" show-meridian="false"\n                            required></timepicker>\n            </div>\n        </div>\n\n        <div class="form-group">\n            <label class="control-label col-sm-2">Task</label>\n\n            <div class="col-sm-10">\n                <select id="task-select" name="task" ng-model="vm.selectedTask" class="combobox form-control" name="horizontal"\n                        required\n                        ng-options="taskId as task.name for (taskId,task) in vm.parent.tasks | invisibleTaskFilter">\n                </select>\n            </div>\n        </div>\n    </form>\n</div>\n<div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="vm.cancel()">Close</button>\n    <button id="saveNewButton" type="button" class="btn btn-primary" ng-click="vm.add()" ng-hide="vm.editMode" ng-disabled="!recordForm.$valid">Add\n    </button>\n    <button id="saveButton" type="button" class="btn btn-primary" ng-click="vm.save()" ng-show="vm.editMode" ng-disabled="!recordForm.$valid">Save\n    </button>\n</div>'),e.put("app/records/records.html",'<div>\r\n    <div id="record" name="record" class="fullsize">\r\n\r\n        <month-selection ng-model="vm.selectedDate" ng-change="vm.loadData()"></month-selection>\r\n\r\n        <div class="panel panel-default">\r\n            <!-- Default panel contents -->\r\n            <div class="panel-heading">Records</div>\r\n            <button ng-click="vm.openEditDialog(-1)" id="add-button" type="button" class="btn btn-default">\r\n                Add\r\n            </button>\r\n            <div class="table-responsive">\r\n\r\n                <table id="taskTable" class="table">\r\n                    <thead>\r\n                    <tr>\r\n                        <th>Day</th>\r\n                        <th>Start time</th>\r\n                        <th>Task</th>\r\n                        <th>{{}}</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr ng-repeat="rec in vm.records track by $index">\r\n                        <td>{{rec.day}}</td>\r\n                        <td>{{rec.hour | prependZeroFilter}}:{{rec.minute | prependZeroFilter}}</td>\r\n                        <td>{{vm.tasks[rec.taskId].name}}</td>\r\n                        <td>\r\n                            <span ng-click="vm.openEditDialog($index)" class=\'glyphicon glyphicon-edit\'></span>\r\n                            <span ng-click="vm.deleteRecord($index)" class=\'glyphicon glyphicon-remove\'></span>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>'),e.put("app/report/report.html",'<div>\r\n    <div name="report" class="fullsize">\r\n\r\n        <month-selection ng-model="vm.selectedDate" ng-change="vm.generateReport()"></month-selection>\r\n\r\n        <div class="panel panel-default">\r\n            <!-- Default panel contents -->\r\n            <div class="panel-heading">Report {{vm.selectedDate.getFullYear()}}-{{vm.selectedDate.getMonth()}}</div>\r\n            <div class="table-responsive">\r\n\r\n                <table id="taskTable" class="table">\r\n                    <thead>\r\n                    <tr>\r\n                        <th>Day</th>\r\n                        <th>Summary</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n\r\n                    <tr ng-repeat="dayEntry in vm.report">\r\n                        <td>{{dayEntry.day}}</td>\r\n                        <td>\r\n                            <ul>\r\n                                <li ng-repeat="taskSummary in dayEntry.taskSummary">{{taskSummary.taskId}}: {{taskSummary.duration}} h</li>\r\n                            </ul>\r\n                            Sum: {{dayEntry.totalDuration}} h\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>'),e.put("app/tasks/edit-task-modal.html",'<div class="modal-header">\n    <h3 class="modal-title">\n        <div ng-hide="vm.editMode">New Task</div>\n        <div ng-show="vm.editMode">Edit Task</div>\n    </h3>\n</div>\n<div class="modal-body">\n    <form name="taskForm" class="form-horizontal" novalidate>\n        <div class="form-group">\n            <label class="control-label col-sm-2">Task Id</label>\n\n            <div class="col-sm-10">\n                <input type="text" class="form-control" placeholder="task id"\n                       aria-describedby="basic-addon1" ng-model="vm.taskId" ng-disabled="vm.editMode" required>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="control-label col-sm-2">Name</label>\n\n            <div class="col-sm-10">\n\n                <input type="text" class="form-control" placeholder="task name"\n                       aria-describedby="basic-addon1" ng-model="vm.taskName" required>\n            </div>\n        </div>\n\n        <div class="form-group">\n\n            <label class="control-label col-sm-2">Selectable</label>\n\n            <div class="col-sm-1">\n                <input type="checkbox" class="form-control" name="selectable" ng-model="vm.selectable" required>\n            </div>\n        </div>\n    </form>\n</div>\n<div class="modal-footer">\n    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="vm.cancel()">Close</button>\n    <button id="saveNewButton" type="button" class="btn btn-primary" ng-click="vm.add()" ng-hide="vm.editMode" ng-disabled="!taskForm.$valid">Add\n    </button>\n    <button id="saveButton" type="button" class="btn btn-primary" ng-click="vm.save()" ng-show="vm.editMode" ng-disabled="!taskForm.$valid">Save\n    </button>\n</div>'),e.put("app/tasks/tasks.html",'<div>\r\n    <div id="record" name="record" class="fullsize">\r\n\r\n        <div class="panel panel-default">\r\n            <!-- Default panel contents -->\r\n            <div class="panel-heading">Tasks</div>\r\n            <button ng-click="vm.openEditDialog()" id="add-button" type="button" class="btn btn-default">\r\n                Add\r\n            </button>\r\n            <div class="table-responsive">\r\n\r\n                <table id="taskTable" class="table">\r\n                    <thead>\r\n                    <tr>\r\n                        <th>Id</th>\r\n                        <th>Name</th>\r\n                        <th>Visible</th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr ng-repeat="(taskId, task) in vm.tasks track by $index">\r\n                        <td>{{taskId}}</td>\r\n                        <td>{{task.name}}</td>\r\n                        <td>{{task.selectable}}</td>\r\n                        <td>\r\n                            <span ng-click="vm.openEditDialog(taskId)" class=\'glyphicon glyphicon-edit\'></span>\r\n                            <!--span ng-click="vm.deleteTask($index)" class=\'glyphicon glyphicon-remove\'></span-->\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>')}]);