var requestsController = (function () {

})(); 

var UIController = (function () {

    return {
        // Take month as number (Jan is 0, Dec is 12)
        populateCalendarTable: function (month, year) {
            console.log(month);
            const monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // populate month title in html
            var curMonthName = monthNames[month];
            $('#month-name').html(curMonthName);

            startDate = new Date(year, month, 1);
            console.log(startDate);
            startDay = startDate.getDay();

            // I think this might not be quite right, will need to experiment
            if (startDay == 0) {
                startDay = 6;
            }
            console.log(startDay);
            let offset = 1 - startDay;

            let daysInMonth = new Date(year, month, 0).getDate();

            // populate table with dates
            var counter = offset;
            for (var i = 0; i < 6; i++) {
                $('#cal-table').find('tbody').append("<tr></tr>");;
                for (var j = 0; j < 7; j++) {
                    if (counter < 1) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
                        counter++;
                    } else if (counter > daysInMonth) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + " " + "</td>")
                    } else {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td> " + counter++ + "</td>")
                    }
                }
            }
        }
    }
})();

var controller = (function (rqsCtrl, UICtrl) {

    var d = new Date;
    var currentMonth = d.getMonth();
    var currentYear= d.getFullYear();


    var setupEventListeners = function () {
        console.log("event listeners set up");

        // add on-click to next-month button
        $("#next-month").click(function() {
            console.log("next month clicked");
            // UICtrl.populateCalendarTable(currentMonth, currentYear);
            });

            $("#prev-month").click(function() {
            console.log("prev month clicked");
            });

    };

    return {
        init: function () {
            setupEventListeners();
            $(document).ready(function () {
                console.log("ready")
                UICtrl.populateCalendarTable(currentMonth, currentYear)
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
