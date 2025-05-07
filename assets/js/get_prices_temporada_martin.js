// assets/js/get_prices_temporada_martin.js
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=436929069&single=true&output=csv')
    .then(response => response.text())
    .then(csv => {
        // Procesar el CSV
        const rows = csv.split('\n');
        const headers = rows[0].split(',').map(header => header.trim().replace(/\r$/, ''));
        const data = [];
        let fechaActualizacion = '';

        // Crear un array de objetos con los datos
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue;

            const values = rows[i].split(',');
            const row = {};

            for (let j = 0; j < headers.length; j++) {
                // Eliminar retornos de carro y espacios
                const value = values[j] ? values[j].trim().replace(/\r$/, '') : '';
                row[headers[j]] = value;

                // Capturar la fecha de actualización si existe
                if (headers[j] === 'fecha_ultima_actualizacion' && value && !fechaActualizacion) {
                    fechaActualizacion = value;
                }
            }

            data.push(row);
        }

        console.log("Datos:", data);
        console.log("Fecha de actualización:", fechaActualizacion);

        // Mostrar solo en el panel de Altos de San Martín
        createTarifasTable(data, 'altos-content', fechaActualizacion);
    })
    .catch(error => console.error('Error al obtener los datos:', error));

function createTarifasTable(data, targetId, fechaActualizacion) {
    // Obtener el contenedor para Altos de San Martín
    const tableSection = document.getElementById(targetId);
    if (!tableSection) return;

    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive';

    const table = document.createElement('table');
    table.className = 'table table-tarifas';

    // Crear encabezado
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Primera columna: Temporada
    const temporadaHeader = document.createElement('th');
    temporadaHeader.textContent = 'Temporada';
    headerRow.appendChild(temporadaHeader);

    // Columnas para pasajeros
    const pax1o2Header = document.createElement('th');
    pax1o2Header.textContent = '1-2 Pasajeros';
    headerRow.appendChild(pax1o2Header);

    const pax3Header = document.createElement('th');
    pax3Header.textContent = '3 Pasajeros';
    headerRow.appendChild(pax3Header);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');

    // Añadir filas de datos
    data.forEach(row => {
        const tr = document.createElement('tr');

        // Temporada (con clase específica para estilo)
        const temporadaCell = document.createElement('td');
        temporadaCell.className = `temporada-${row.pasajeros.toLowerCase()}`;
        temporadaCell.textContent = row.pasajeros.toUpperCase();
        tr.appendChild(temporadaCell);

        // Precios por cantidad de pasajeros
        const pax1o2Cell = document.createElement('td');
        pax1o2Cell.textContent = `$${row['1 o 2']} USD`;
        tr.appendChild(pax1o2Cell);

        const pax3Cell = document.createElement('td');
        pax3Cell.textContent = `$${row['3']} USD`;
        tr.appendChild(pax3Cell);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Crear contenedor para la fecha de actualización
    const updateContainer = document.createElement('div');
    updateContainer.className = 'actualizacion-container';

    const updateInfo = document.createElement('p');
    updateInfo.className = 'actualizacion-fecha';

    // Formatear la fecha si existe
    const fechaTexto = fechaActualizacion ?
        `Última actualización: ${fechaActualizacion}` :
        'Precios actualizados';

    updateInfo.textContent = fechaTexto;

    // Añadir todo al contenedor
    updateContainer.appendChild(updateInfo);
    tableSection.innerHTML = '';
    tableSection.appendChild(tableContainer);
    tableSection.appendChild(updateContainer);
}