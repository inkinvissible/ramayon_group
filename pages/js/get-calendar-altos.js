"use strict";

const url =
    "https://serverless-ramayon-oqj4x4u96-inkinvissibles-projects.vercel.app/api/proxy?url=" +
    encodeURIComponent(
        "https://www.airbnb.com/calendar/ical/48895031.ics?s=94126301f736853a62f921ca37ad64d7&locale=es-AR"
    );

const getData = async () => {
  try {
    const response = await axios.get(url);
    
    const data = await response.data;

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
    const today = new Date();
    const fourMonthsLater = new Date();
    fourMonthsLater.setMonth(today.getMonth() + 4);

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
      validRange: {
        start: today,
        end: fourMonthsLater,
      },
    });
    calendar.render();

    // Generar tarjetas de disponibilidad
    generateAvailabilityCards(events, today, fourMonthsLater);
  } catch (error) {
    console.error(error);
    alert(
      "Error al obtener los datos del calendario. Por favor, inténtalo más tarde."
    );
  }
};

const generateAvailabilityCards = (events, today, fourMonthsLater) => {
  const availabilityContainer = document.getElementById("availability");
  availabilityContainer.innerHTML = ""; // Limpiar contenido existente

  // Ordenar eventos por fecha de inicio
  const sortedEvents = events
    .map((event) => new ICAL.Event(event))
    .sort((a, b) => a.startDate.toJSDate() - b.startDate.toJSDate());

  const availablePeriods = [];
  let lastEnd = today;

  sortedEvents.forEach((event) => {
    const eventStart = event.startDate.toJSDate();
    if (eventStart > lastEnd) {
      availablePeriods.push({ start: lastEnd, end: eventStart });
    }
    const eventEnd = event.endDate.toJSDate();
    if (eventEnd > lastEnd) {
      lastEnd = eventEnd;
    }
  });

  if (lastEnd < fourMonthsLater) {
    availablePeriods.push({ start: lastEnd, end: fourMonthsLater });
  }

  // Limitar a 3 tarjetas
  availablePeriods.slice(0, 3).forEach((period) => {
    const card = document.createElement("div");
    card.className = "col-lg-4 col-md-6";

    const boxDiv = document.createElement("div");
    boxDiv.className = "box mt-4";
    boxDiv.setAttribute("data-aos", "zoom-in");
    boxDiv.setAttribute("data-aos-delay", "100");

    const title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = "Disponible";

    const text = document.createElement("p");
    text.className = "card-text";
    text.textContent = `Del ${formatDate(period.start)} al ${formatDate(period.end, 0)}`;

    boxDiv.appendChild(title);
    boxDiv.appendChild(text);
    card.appendChild(boxDiv);
    availabilityContainer.appendChild(card);
  });
};

const formatDate = (date, adjust = 0) => {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + adjust);
  const day = adjustedDate.getDate();
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
  const month = months[adjustedDate.getMonth()];
  return `${day} de ${month}`;
};

getData();