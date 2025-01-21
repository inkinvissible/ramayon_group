const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=569780836&single=true&output=csv";

// Función para convertir CSV a un objeto estructurado
function parseCSV(csvText) {
  console.log("Texto CSV recibido:", csvText);
  const rows = csvText.split("\n");
  console.log("Filas del CSV:", rows);
  const headers = rows[0].split(",");
  console.log("Encabezados:", headers);
  
  const structuredData = {};

  rows.slice(1).forEach((row) => {
    const cells = row.split(",");
    console.log("Celdas de la fila:", cells);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = cells[i] ? cells[i].trim() : "";
    });
    console.log("Objeto fila:", obj);
    
    const { desde, hasta, pax, ...locations } = obj;
    for (const [location, price] of Object.entries(locations)) {
      if (price) {
        if (!structuredData[location.toLowerCase()]) {
          structuredData[location.toLowerCase()] = {
            desde: obj.desde,
            hasta: obj.hasta,
            pax: {}
          };
        }
        structuredData[location.toLowerCase()].pax[obj.pax] = price;
      }
    }
  });

  console.log("Datos estructurados:", structuredData);
  return structuredData;
}

// Cargar el CSV y mostrar los datos
fetch(csvUrl)
  .then((response) => {
    console.log("Respuesta del fetch:", response);
    return response.text();
  })
  .then((csvText) => {
    console.log("Texto CSV antes de parsear:", csvText);
    const data = parseCSV(csvText);
    console.log(data);
    
    // Obtener el contenedor actual
    const containerSection = document.querySelector("section[id^='container']");
    if (!containerSection) {
      console.error("No se encontró ningún contenedor válido.");
      return;
    }
    
    // Extraer el nombre de la ubicación del ID del contenedor
    const containerId = containerSection.id; // Ejemplo: "containerMolinos"
    const locationName = containerId.replace('container', '').toLowerCase(); // Ejemplo: "molinos"
    
    // Obtener los datos para la ubicación específica
    const locationData = data[locationName];
    if (!locationData) {
      console.error(`No hay datos disponibles para la ubicación: ${locationName}`);
      return;
    }
    
    // Seleccionar el contenedor principal donde se agregarán las cajas
    const container = containerSection.querySelector(".row");
    if (!container) {
      console.error("No se encontró el contenedor `.row` dentro del contenedor principal.");
      return;
    }
    
    // Generar y agregar las cajas correspondientes
    for (const [pax, price] of Object.entries(locationData.pax)) {
      const colDiv = document.createElement("div");
      colDiv.className = "col-lg-4";
      
      const boxDiv = document.createElement("div");
      boxDiv.className = "box mt-4";
      boxDiv.setAttribute("data-aos", "zoom-in");
      boxDiv.setAttribute("data-aos-delay", "50");
      
      const span = document.createElement("span");
      span.textContent = `${pax} Pasajeros`;
      
      const h4 = document.createElement("h4");
      h4.textContent = `Precio: $${price}`;
      
      const p = document.createElement("p");
      p.textContent = `Tarifa final por noche para todos los pasajeros`;

      const from = document.createElement("p");
      from.className = "mt-2";
      from.textContent = `Desde: ${locationData.desde}`;

      const to = document.createElement("p");
      to.textContent = `Hasta: ${locationData.hasta}`;
      
      boxDiv.appendChild(span);
      boxDiv.appendChild(h4);
      boxDiv.appendChild(p);
      boxDiv.appendChild(from);
      boxDiv.appendChild(to);
      colDiv.appendChild(boxDiv);
      container.appendChild(colDiv);
    }
  })
  .catch((error) => {
    console.error("Error al cargar el CSV:", error);
  });