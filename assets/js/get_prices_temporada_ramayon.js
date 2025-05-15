// Función para cargar y mostrar las tarifas de Ramayon House (transpuesta)
document.addEventListener("DOMContentLoaded", function() {
    const ramayon_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=2087699453&single=true&output=csv';

    fetch(ramayon_url)
        .then(response => response.text())
        .then(data => {
            processRamayonDataTranspuesta(data);
        })
        .catch(error => {
            console.error('Error al cargar las tarifas de Ramayon House:', error);
            document.getElementById('loading-ramayon').innerHTML =
                '<p class="text-danger">Error al cargar las tarifas. Por favor, intenta más tarde.</p>';
        });
});

function processRamayonDataTranspuesta(csvData) {
    const lines = csvData.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;

    // Cabeceras: Temporada, 1-2, 3, 4, fecha
    const headers = lines[0].split(',').map(h => h.trim());
    const pasajeros = headers.slice(1, 4); // ['1-2 Pasajeros', '3 Pasajeros', '4 Pasajeros']

    // Mapear temporadas y valores
    const temporadas = ['baja', 'media', 'alta'];
    const temporadaLabels = {
        baja: 'BAJA',
        media: 'MEDIA',
        alta: 'ALTA'
    };
    const temporadaClases = {
        baja: 'temporada-baja',
        media: 'temporada-media',
        alta: 'temporada-alta'
    };

    // Construir estructura: { pasajero: { baja: val, media: val, alta: val } }
    const preciosPorPasajero = {};
    let fechaActualizacion = '';

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(x => x.trim());
        if (row.length < 4) continue;
        const temporada = row[0].toLowerCase();
        if (!temporadas.includes(temporada)) continue;

        pasajeros.forEach((pax, idx) => {
            if (!preciosPorPasajero[pax]) preciosPorPasajero[pax] = {};
            preciosPorPasajero[pax][temporada] = row[idx + 1] ? `AR$ ${row[idx + 1]}` : '-';
        });

        // Tomar la fecha de actualización de la primera fila válida
        if (!fechaActualizacion && row[4]) fechaActualizacion = row[4];
    }

    // Construir tabla transpuesta
    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-tarifas">
                <thead>
                    <tr>
                        <th>PAX</th>
                        <th class="temporada-baja">BAJA</th>
                        <th class="temporada-media">MEDIA</th>
                        <th class="temporada-alta">ALTA</th>
                    </tr>
                </thead>
                <tbody>`;

    pasajeros.forEach(pax => {
        tableHtml += `<tr><td>${pax}</td>`;
        temporadas.forEach(temp => {
            tableHtml += `<td class="${temporadaClases[temp]}">${preciosPorPasajero[pax]?.[temp] || '-'}</td>`;
        });
        tableHtml += `</tr>`;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
        <div class="actualizacion-container">
            <small class="actualizacion-fecha">Tarifas por noche  finales con Impuestos incluidos, expresadas en Pesos Argentinos. Las mismas podrán sufrir modificaciones sin previo aviso, salvo para las reservas ya confirmadas</small>
            <br> <br> <small class="actualizacion-fecha mt-2">Última actualización: ${fechaActualizacion || 'No disponible'}</small>
        </div>`;

    document.getElementById('loading-ramayon').style.display = 'none';
    document.getElementById('ramayon-content').innerHTML = tableHtml;
}