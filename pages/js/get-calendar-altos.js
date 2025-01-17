"use strict";

const getData = async () => {
  try {
    // const response = await axios.get(
    //     "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.airbnb.com/calendar/ical/48895031.ics?s=94126301f736853a62f921ca37ad64d7&locale=es-AR"),
    //     {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }
    // );
    const response = await fetch("./ics/listing-48895031.ics");
    const data = await response.text();

    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent");

    const availabilityData = events.map((event) => {
      const e = new ICAL.Event(event);
      return {
        title: "No disponible",
        start: e.startDate.toJSDate(),
        end: e.endDate.toJSDate(),
        description: `No disponible desde ${e.startDate.toString()} hasta ${e.endDate.toString()}`,
        color: "#dc3545", // Fondo rojo
        textColor: "#ffffff", // Texto blanco
        borderColor: "#dc3545", // Borde rojo
      };
    });

    // Configurar el calendario
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth",
      },
      locale: "es",
      buttonText: {
        today: "Hoy",
        month: "Mes",
      },
      initialView: "dayGridMonth",
      events: availabilityData,
      height: "auto",
      contentHeight: "auto",
      nowIndicator: true,
      navLinks: true,
      editable: false,
      dayMaxEvents: true,
    });
    calendar.render();

    // Generar tarjetas de disponibilidad
    generateAvailabilityCards(events);
  } catch (error) {
    console.error(error);
    alert(
      "Error al obtener los datos del calendario. Por favor, inténtalo más tarde."
    );
  }
};

const generateAvailabilityCards = (events) => {
  const availabilityContainer = document.getElementById("availability");
  availabilityContainer.innerHTML = ""; // Limpiar contenido existente
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const today = new Date();
  const thisMonth = months[today.getMonth()];

  // Filtrar eventos futuros
  const futureEvents = events.filter((event) => {
    const e = new ICAL.Event(event);
    return e.endDate.toJSDate() >= today;
  });

  // Generar tarjetas basadas en eventos
  futureEvents.forEach((event, index) => {
    if (index < 3) {
      // Limitar a 3 tarjetas
      const e = new ICAL.Event(event);
      const card = document.createElement("div");
      card.className = "col-lg-4 col-md-6";
      
      
      
      const boxDiv = document.createElement("div");
      boxDiv.className = "box mt-4";
      boxDiv.setAttribute("data-aos", "zoom-in");
      boxDiv.setAttribute("data-aos-delay", "100");
      
      const title = document.createElement("h4");
      title.className = "card-title";
      title.textContent = "No Disponible";
      
      const text = document.createElement("p");
      text.className = "card-text";
      text.textContent = `Del ${formatDate(e.startDate)} al ${formatDate(e.endDate, -1)}`;
      
      boxDiv.appendChild(title);
      boxDiv.appendChild(text);
      card.appendChild(boxDiv);
      availabilityContainer.appendChild(card);
    }
  });
};

const formatDate = (icalDate, adjust = 0) => {
  const date = icalDate.toJSDate();
  date.setDate(date.getDate() + adjust);
  const day = date.getDate();
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = months[date.getMonth()];
  return `${day} de ${month}`;
};

getData();
