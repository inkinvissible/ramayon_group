// assets/js/get_prices_temporada_martin.js
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=436929069&single=true&output=csv')
    .then(response => response.text())
    .then(csv => {
        const rows = csv.split('\n').filter(r => r.trim() !== '');
        const headers = rows[0].split(',').map(h => h.trim().replace(/\r$/, ''));
        const data = [];
        let fechaActualizacion = '';

        // Organizar datos por temporada
        const temporadas = {};
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',');
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                const value = values[j] ? values[j].trim().replace(/\r$/, '') : '';
                row[headers[j]] = value;
                if (headers[j] === 'fecha_ultima_actualizacion' && value && !fechaActualizacion) {
                    fechaActualizacion = value;
                }
            }
            if (row.pasajeros) {
                temporadas[row.pasajeros.toLowerCase()] = row;
            }
        }

        // Obtener lista de pasajeros y temporadas
        const pasajeros = ['1 o 2', '3'];
        const nombresTemporadas = [
            { key: 'baja', label: 'BAJA', clase: 'temporada-baja' },
            { key: 'media', label: 'MEDIA', clase: 'temporada-media' },
            { key: 'alta', label: 'ALTA', clase: 'temporada-alta' }
        ];

        createTarifasTableTranspuesta(pasajeros, nombresTemporadas, temporadas, 'altos-content', fechaActualizacion);
    })
    .catch(error => console.error('Error al obtener los datos:', error));

function createTarifasTableTranspuesta(pasajeros, nombresTemporadas, temporadas, targetId, fechaActualizacion) {
    const tableSection = document.getElementById(targetId);
    if (!tableSection) return;

    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive';

    const table = document.createElement('table');
    table.className = 'table table-tarifas';

    // Encabezado: Temporada
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const thPasajeros = document.createElement('th');
    thPasajeros.textContent = 'Pasajeros';
    headerRow.appendChild(thPasajeros);

    nombresTemporadas.forEach(temp => {
        const th = document.createElement('th');
        th.textContent = temp.label;
        th.className = temp.clase;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cuerpo: filas por cantidad de pasajeros
    const tbody = document.createElement('tbody');
    pasajeros.forEach(pax => {
        const tr = document.createElement('tr');
        const tdPax = document.createElement('td');
        tdPax.textContent = pax;
        tr.appendChild(tdPax);

        nombresTemporadas.forEach(temp => {
            const td = document.createElement('td');
            const temporadaData = temporadas[temp.key];
            if (temporadaData && temporadaData[pax]) {
                td.textContent = `AR$ ${temporadaData[pax]}`;
            } else {
                td.textContent = '-';
            }
            td.className = temp.clase;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    // Fecha de actualización
    const updateContainer = document.createElement('div');
    updateContainer.className = 'actualizacion-container';
    const updateInfo = document.createElement('p');
    updateInfo.className = 'actualizacion-fecha';
    updateInfo.textContent = fechaActualizacion ?
        `Última actualización: ${fechaActualizacion}` :
        'Precios actualizados';
    updateContainer.appendChild(updateInfo);

    tableSection.innerHTML = '';
    tableSection.appendChild(tableContainer);
    tableSection.appendChild(updateContainer);
}