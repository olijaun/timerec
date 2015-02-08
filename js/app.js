
var selectedMonth;
var selectedYear;

window.onload = function() {
    //document.getElementById("body").innerHTML  = 'hello world';

    //$('body').html('Hello from jQuery');

    'use strict';
    console.log('Registering handler ...');
    var addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', addRecord);


    $('#taskTable').dynatable({features: {
        paginate: false,
            search: false,
            recordCount: false,
            perPageSelect: false
    }});


    $( "#datepicker" ).datepicker();

    $("#datepicker").datepicker({
        onSelect: function(dateText) {
            var day = $("#datepicker").datepicker('getDate').getDate();
            selectedMonth = $("#datepicker").datepicker('getDate').getMonth() + 1;
            selectedYear = $("#datepicker").datepicker('getDate').getFullYear();
        }
    }).on("change", function() {
        var day = $("#datepicker").datepicker('getDate').getDate();
        selectedMonth = $("#datepicker").datepicker('getDate').getMonth() + 1;
        selectedYear = $("#datepicker").datepicker('getDate').getFullYear();
    });

};

function addRecord() {
    'use strict';

    var dynatable = $('#taskTable').data('dynatable');

    //$( "#datepicker" ).datepicker().getDay();
    var day = "" + $("#datepicker").datepicker('getDate').getDate();

    var newRecord = {day: day, start: "b", task: "c"};
    dynatable.settings.dataset.records.push(newRecord);
    //dynatable.records.updateFromJson({records: myRecords});
    //dynatable.records.init();
    dynatable.process();

    //var t = $('#example').DataTable();

    //t.row.add( [
    //    'A',
    //    'A',
    //    'A'
    //] ).draw();

    //var table = $('#taskTable')[0];
    //var row = table.insertRow(-1);
    //var cell1 = row.insertCell(0);
    //var cell2 = row.insertCell(1);
    //var cell3 = row.insertCell(2);
    //cell1.innerHTML = "Z";
    //cell2.innerHTML = "A";
    //cell3.innerHTML = "B";

    //dynatable.dom.sort();
}

