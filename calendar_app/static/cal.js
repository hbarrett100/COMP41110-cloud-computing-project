$(document).ready(function () {
    console.log("Ready!");

    // create function to populate calendar - will be called for each month when arrows pressed
    function daysInMonth (month, year) { 
        return new Date(year, month, 0).getDate(); 
    } 
    
    var d = new Date;
    var month = d.getMonth()+1;
    var year = d.getYear();
    days = daysInMonth(month, year);
    console.log("Num of days: " + days);
    
    // first day of month
    startDate = new Date(d.getFullYear(), d.getMonth(), 1);
    startDay = startDate.getDay();
    if (startDay == 0){
        startDay = 6;
    }
    
    var offset = 1-startDay;

    // populate table with dates
    var counter = offset;
    for (var i = 0; i < 6; i++) {
        $('#cal-table').find('tbody').append("<tr></tr>");;
        for (var j = 0; j < 7; j++) {
            if (counter < 1){
                $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
                counter++;
            } else if (counter > days){
                $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
            } else {
                $('#cal-table').find('tbody tr').eq(-1).append("<td> " + counter++ + "</td>")
            }
        }
    }


});














