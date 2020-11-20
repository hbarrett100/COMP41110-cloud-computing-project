var requestsController = (function () {

})(); 

var UIController = (function () {

    var d = new Date;
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();

    return {
        displayedMonthOffset: 0,

        populateCalendarTable: function () {

            $("#cal-table > tbody").empty();
            let monthOffset = this.displayedMonthOffset;

            var newD = new Date(currentYear, currentMonth + monthOffset, 1);
            var month = newD.getMonth();
            var year = newD.getFullYear();

            console.log(" month:" + month);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // display month and year above table
            var curMonthName = monthNames[month];
            $('#month-name').html(curMonthName + " " + year);

            // first day of month
            startDay = newD.getDay();
            console.log("start day: " + startDay);

            // set sunday equal to 7
            if (startDay == 0) {
                startDay = 7;
            }

            // day offset for calendar display
            let dayOffset = startDay -1;
            console.log("offset: "+ dayOffset);
            // number of days in month for calendar display
            let daysInMonth = new Date(year, month+1, 0).getDate();
            console.log("Days in month: " + daysInMonth);

            // populate table with dates
            counter = 1;
            console.log("counter: " + counter);

            // for (var i = 0; i < 6; i++) {
            while (counter <= daysInMonth){
                $('#cal-table').find('tbody').append("<tr></tr>");
                for (var j = 0; j < 7; j++) {
                    if (dayOffset > 0) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
                        dayOffset--;
                        console.log("inside loop offset: " + dayOffset);
                    } else if (counter > daysInMonth) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
                    } else {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + counter++ + "</td>")
                    }
                }
            }
            $('#cal-table').find('tbody tr td').addClass("table-cell");
            $('#cal-table').find('tbody tr td').attr("data-toggle",'modal');
            $('#cal-table').find('tbody tr td').attr('data-target', 'event-modal');

        }
    }
})();

var controller = (function (rqsCtrl, UICtrl) {

    var setupEventListeners = function () {
        console.log("event listeners set up");

        // add on-click to next-month button
        $("#next").click(function() {
            console.log("next month clicked");
            UICtrl.displayedMonthOffset++;
            console.log("offset:");
            console.log(UICtrl.displayedMonthOffset);
            UICtrl.populateCalendarTable();
            });

        $("#prev").click(function() {
            UICtrl.displayedMonthOffset--;
            console.log("offset:");
            console.log(UICtrl.displayedMonthOffset);
            UICtrl.populateCalendarTable();
            });

        $('#cal-table').on('click','td',function(){
            console.log("td clicked!");
            $("#event-modal").modal('show');
        });
    
    };

   
    return {
        init: function () {
            
            $(document).ready(function () {
                setupEventListeners();
                console.log("ready")
                UICtrl.populateCalendarTable();
            });

        }
    }

})(requestsController, UIController);


controller.init();

// email validation on login page
$(function () {
    $("form[name='login']").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            email: "Please enter a valid email address"
        },
        submitHandler: function (form) {
            form.submit();
            console.log("form submitted")
        }
    });
});
