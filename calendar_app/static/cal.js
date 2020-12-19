// requests controller manages any functions related to AJAX requests
var requestsController = (function () {

    return {

        // populate calendar with any existing events
        populateCalendarWithEvents: function (month, year) {
            // send get request for all events in current month and year
            return $.getJSON("/get_events", { email: email, month: month + 1, year: year })
        },

        // new event
        createEvent: function (values) {
            // pass values from form to route in post request
            console.log("inside create event fn");
            return $.post("/create_event", values);
        },

        // get event details for specific date
        getEventOnDate: function (date, month, year) {
            return $.getJSON("/get_events", { email: email, date: date, month: month + 1, year: year })
        },

        // delete event from database
        deleteEvent: function (id) {
            console.log("inside deletre")
            return $.post("/delete", { id: id });
        },

        // edit event 
        editEvent: function (values) {
            return $.post("/create_event", values);
        },

        //share calendar
        shareCalendar: function (shareEmail) {
            return $.post("/share_calendar", { email: email, share_email: shareEmail });
        },

        //search for event
        searchEvent: function (search) {
            return $.getJSON("/search_event", { email: email, search: search });
        },
    }
})();

// UI controller manages any functions related to the DOM
var UIController = (function () {

    var d = new Date;
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return {
        displayedMonthOffset: 0,

        // get current month and year
        getCurrentMonthYear: function () {
            var newD = new Date(currentYear, currentMonth + this.displayedMonthOffset, 1);
            var dispmonth = newD.getMonth();
            var dispyear = newD.getFullYear();
            return {
                month: dispmonth,
                year: dispyear
            }
        },

        // populate calendar table with dates and events
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
            let dayOffset = startDay - 1;
            console.log("offset: " + dayOffset);
            // number of days in month for calendar display
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            console.log("Days in month: " + daysInMonth);

            // populate table with dates
            counter = 1;
            console.log("counter: " + counter);

            while (counter <= daysInMonth) {
                $('#cal-table').find('tbody').append("<tr></tr>");
                for (var j = 0; j < 7; j++) {
                    if (dayOffset > 0) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td class='empty'> " + " " + "</td>")
                        dayOffset--;
                        console.log("inside loop offset: " + dayOffset);
                    } else if (counter > daysInMonth) {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td class='empty'> " + " " + "</td>")
                    } else {
                        $('#cal-table').find('tbody tr').eq(-1).append("<td class='table-cell'> " + counter++ + "</td>")
                    }
                }
            }
            // assign modal attributes to all tds
            $('.table-cell').attr("data-toggle", 'modal');
            $('.table-cell').attr('data-target', 'event-modal');

            return {
                month: month,
                year: year
            }

        },

        // populate event card with details of events
        populateEventCard: function (date, data, search = false) {
            $("#events-list").html('');

            // display message if no search results
            if (!search && data.length == 0) {
                $("#events-list").html('No events on this date.');
            } else if (data.length == 0) {
                $("#events-list").html('No events match your search.');
            }
            if (search) {
                $('#card-title').html('Search Results')
            }

            data.forEach(event => {
                let html = `<li class="list-group-item">
                    <h3 class="title">${event.title}</h3>`;
                html += search ? `<p>${event.date}</p>` : '';
                html += ` <p class="times">${event.start}-${event.end}</p>
                <p class="description">${event.description}</p>
                <button type="button" class="edit btn btn-light" data-toggle="modal" data-target="#create-event" data-event-id=${event.id}>edit</button>
                    <button type="button" class="delete btn btn-light" data-event-id=${event.id}>delete</button>
                    </li>`;

                $("#events-list").append(html)
            });

            var monthYear = $('#month-name').text();
            if (date) {
                $('#card-title').html("<span id='date'>" + date + "</span>" + " " + monthYear);

            }

        },

        // modal to create new event
        newEventModal: function () {
            $('#title').val("");
            // set up date and time pickers
            $("#datepicker").flatpickr({
                dateFormat: 'd-m-yy',
                defaultDate: new Date(),
                minDate: "today"
            });
            $('.timepicker').flatpickr({
                enableTime: true,
                defaultDate: new Date().getHours() + ":" + new Date().getMinutes(),
                dateFormat: 'H:i',
                noCalendar: true,
                time_24hr: true,
                minuteIncrement: 30
            });
        },

        // set all day event if checkbox checked
        setAllDayEvent: function () {
            $('#start-timepicker').val("");
            $('#end-timepicker').val("");
            $('#start-timepicker').prop("disabled", true);
            $('#end-timepicker').prop("disabled", true);

        },
        // unset all day event if checkbox unchecked
        unsetAllDayEvent: function () {
            console.log("inside unset")
            $('#start-timepicker').removeAttr("disabled");
            $('#end-timepicker').removeAttr("disabled");
        },

        // get values out of new event form 
        getDataFromEventForm: function () {
            var date = $('#datepicker').val();
            var startTime = $('#start-timepicker').val();
            var endTime = $('#end-timepicker').val();
            var title = $('#title').val();
            var description = $('#description').val();
            console.log(date, startTime, endTime, title, description);

            return {
                email: email,
                date: date,
                startTime: startTime,
                endTime: endTime,
                title: title,
                description: description
            }
        },

        // mark dates in calendar which have an event with dot
        markDatesWithEvent: function (events) {
            $(".dot").remove();
            // find table cell with number of date
            var dates = [];
            events.forEach(event => {
                event_date = event.date.split("-")[0].trim()
                // if number less than 10 remove zero at start
                if (event_date.charAt(0) == "0") {
                    event_date = event_date.slice(1, 2);
                }
                dates.push(event_date)
            });
            $("#cal-table tr").each(function () {

                $('td', this).each(function () {
                    var $cell = $(this);
                    var d = $cell.text().toString().trim();

                    if (dates.includes(d)) {
                        $cell.append('<span class="dot"></span>');
                    }
                })
            })
        },

        // display result of calendar sharing
        displaySharingResult: function (result) {
            if (!result) {
                $('#share-error').show();
            } else {
                $('#share-success').show();
            }
        }
    }
})();

// main controller which calls methods in requests controller and UI controller
var controller = (function (rqsCtrl, UICtrl) {

    var setupEventListeners = function () {

        // next-month button
        $("#next").click(function () {
            UICtrl.displayedMonthOffset++;
            monthAndYear = UICtrl.populateCalendarTable();
            eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                UICtrl.markDatesWithEvent(data);
            });

        });

        // previous month 
        $("#prev").click(function () {
            UICtrl.displayedMonthOffset--;
            monthAndYear = UICtrl.populateCalendarTable();
            eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                UICtrl.markDatesWithEvent(data);
            });
        });

        // all table cells
        $('#cal-table').on('click', '.table-cell', function (event) {
            let thisElem = event.target
            date = $(thisElem).text().trim();
            monthAndYear = UICtrl.getCurrentMonthYear();

            eventsOnDate = rqsCtrl.getEventOnDate(date, monthAndYear['month'], monthAndYear['year']).done(function (data) {
                UICtrl.populateEventCard(date, data);
            });
        });

        // create event
        $("#create").click(function () {
            console.log("Create");
            $('#modal-heading').html('Create New Event');
            $('#create-event').attr("data-event-id", '')
            UICtrl.newEventModal();

        });

        // full day event checkbox
        $('#all-day-check').change(function () {
            if ($('#all-day-check').is(':checked'))
                UICtrl.setAllDayEvent();
            else
                UICtrl.unsetAllDayEvent();
        })

        // save new event button 
        $("#save-event").click(function (event) {
            // show error if title not given by user
            if ($('#title').val() == '') {
                $('#title-error').show();

                // only create event once title has been entered
            } else {
                $('#title-error').hide();
                $("#create-event").modal('hide');
                // if data attr is empty, call create event route
                // else call edit event route
                if ($('#create-event').attr("data-event-id") === "") {
                    var formValues = UICtrl.getDataFromEventForm();
                    rqsCtrl.createEvent(formValues).done(function () {
                        monthAndYear = UICtrl.getCurrentMonthYear();
                        // update events on calendar
                        eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                            UICtrl.markDatesWithEvent(data);
                        });
                        // update events on event card
                        let date = $('#date').text();
                        eventsOnDate = rqsCtrl.getEventOnDate(date, monthAndYear['month'], monthAndYear['year']).done(function (data) {
                            UICtrl.populateEventCard(date, data);
                        });

                    });;
                } else {
                    var formValues = UICtrl.getDataFromEventForm();
                    let eventId = $('#create-event').attr("data-event-id");
                    formValues['eventId'] = eventId; //add event id to object
                    rqsCtrl.editEvent(formValues).done(function () {
                        monthAndYear = UICtrl.getCurrentMonthYear();
                        // update events on calendar
                        eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                            UICtrl.markDatesWithEvent(data);
                        });
                        // update events on event card
                        let date = $('#date').text();
                        eventsOnDate = rqsCtrl.getEventOnDate(date, monthAndYear['month'], monthAndYear['year']).done(function (data) {
                            UICtrl.populateEventCard(date, data);
                        });

                    });

                }
            }
        });

        $('#events-list').on('click', '.delete', function (event) {
            let thisElem = event.target
            let id = $(thisElem).attr("data-event-id")
            rqsCtrl.deleteEvent(id).done(function () {
                monthAndYear = UICtrl.getCurrentMonthYear();
                // update events on calendar
                eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                    UICtrl.markDatesWithEvent(data);
                })
                // update events on event card
                let date = $('#date').text();
                eventsOnDate = rqsCtrl.getEventOnDate(date, monthAndYear['month'], monthAndYear['year']).done(function (data) {
                    UICtrl.populateEventCard(date, data);
                });
            }
            );
        });

        $('#events-list').on('click', '.edit', function (event) {
            $('#modal-heading').html('Edit Event');
            let thisElem = event.target
            let id = $(thisElem).attr("data-event-id")
            $('#create-event').attr("data-event-id", id);
            let par = $(thisElem).parent();
            let title = par.find(".title").text();
            let start = par.find(".times").text().split("-")[0];
            let end = par.find(".times").text().split("-")[1];
            let description = par.find(".description").text();

            // populate modal with above deets
            UICtrl.newEventModal();
            $('#start-timepicker').val(start);
            $('#end-timepicker').val(end);
            $('#title').val(title);
            $('#description').val(description);

            //date
            date = $('#date').text().trim();
            monthAndYear = UICtrl.getCurrentMonthYear();
            month = monthAndYear['month'] + 1;
            year = monthAndYear['year'];
            $('#datepicker').val(date + '-' + month + '-' + year);
        });

        // share calendar
        $("#share").click(function () {
            let shareEmail = $('#share_email').val(); // get value out of input box
            $('#share_email').val('');
            rqsCtrl.shareCalendar(shareEmail).done(function () {
                UICtrl.displaySharingResult(true);
            }).fail(function () {
                UICtrl.displaySharingResult(false);
            });
        });

        // search for event
        $("#search").click(function () {

            let search = $('#search-input').val(); // get value out of input box
            rqsCtrl.searchEvent(search).done(function (data) {
                UICtrl.populateEventCard(false, data, search = true);
            });
        });
    };


    return {
        // called when page loads
        init: function () {

            $(document).ready(function () {
                setupEventListeners();
                UICtrl.populateCalendarTable();
                // get current month and year
                monthAndYear = UICtrl.getCurrentMonthYear();
                eventsInMonth = rqsCtrl.populateCalendarWithEvents(monthAndYear['month'], monthAndYear['year']).done(function (data) {
                    UICtrl.markDatesWithEvent(data);
                })
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


