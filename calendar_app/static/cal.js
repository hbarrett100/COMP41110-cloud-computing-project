var requestsController = (function () {

})(); 

var UIController = (function () {

    var d = new Date;
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

    return {
        displayedMonthOffset: 0,

        populateCalendarTable: function () {

            $("#cal-table > tbody").empty();
            let monthOffset = this.displayedMonthOffset;

            var newD = new Date(currentYear, currentMonth + monthOffset, 1);
            var month = newD.getMonth();
            var year = newD.getFullYear();


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
                        $('#cal-table').find('tbody tr').eq(-1).append("<td class='table-cell' > " + counter++ + "</td>")
                    }
                }
            }
            // assign modal attributes to all tds
            // $('#cal-table').find('tbody tr td').addClass("table-cell");
            $('.table-cell').attr("data-toggle",'modal');
            $('.table-cell').attr('data-target', 'event-modal');
        },

        populateEventModal: function(thisElem) {
            // set date selected as title of modal
            var monthYear = $('#month-name').text();
            $('#modal-header').html(thisElem.innerHTML + " " + monthYear);

        },

        newEventModal: function() {
            console.log("inside fn");
            datepicker = $("#date").flatpickr({
                dateFormat: 'd-m-yy',
                defaultDate: new Date(),
                minDate: "today"
            });
        }
    }
})();

var controller = (function (rqsCtrl, UICtrl) {

    var setupEventListeners = function () {

        // add on-click to next-month button
        $("#next").click(function() {
            UICtrl.displayedMonthOffset++;
            UICtrl.populateCalendarTable();
            });

        $("#prev").click(function() {
            UICtrl.displayedMonthOffset--;
            UICtrl.populateCalendarTable();
            });

        $('#cal-table').on('click','.table-cell',function(event){
            $("#event-modal").modal('show');
            
            let thisElem = event.target
            UICtrl.populateEventModal(thisElem)
           
        });

        $("#create").click(function() {
           console.log("Create");
           UICtrl.newEventModal();
            });
    };

   
    return {
        init: function () {
            
            $(document).ready(function () {
                setupEventListeners();
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
