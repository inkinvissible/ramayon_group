const getData = async () => {
    try {
        const response = await axios.get(
            "https://cors-anywhere.herokuapp.com/https://www.airbnb.com/calendar/ical/48895031.ics?s=94126301f736853a62f921ca37ad64d7&locale=es-AR"
        );
        console.log(response.data);
        const jcalData = ICAL.parse(response.data);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent");
        const availability = events.map((event) => {
            const e = new ICAL.Event(event);
            return {
                title: "No disponible",
                start: e.startDate.toJSDate(),
                end: e.endDate.toJSDate(),
                description: `No disponible desde ${e.startDate.toString()} hasta ${e.endDate.toString()}`,
                color: '#dc3545'

            };
        });

        const calendarEl = document.getElementById("calendar");
        const calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
            },
            locale: 'es',
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
            },
            initialView: 'dayGridMonth',
            events: availability,
            eventDidMount: function(info) {
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'fc-event-tooltip';
                tooltip.innerHTML = info.event.extendedProps.description;
                document.body.appendChild(tooltip);

                // Position tooltip on hover
                info.el.addEventListener('mouseenter', function(e) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = e.pageX + 10 + 'px';
                    tooltip.style.top = e.pageY + 10 + 'px';
                });

                info.el.addEventListener('mousemove', function(e) {
                    tooltip.style.left = e.pageX + 10 + 'px';
                    tooltip.style.top = e.pageY + 10 + 'px';
                });

                info.el.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                });
            },
            height: 'auto',
            contentHeight: 'auto',
            nowIndicator: true,
            navLinks: true,
            editable: false,
            dayMaxEvents: true
        });
        calendar.render();
    } catch (error) {
        console.error(error);
    }
};

getData();