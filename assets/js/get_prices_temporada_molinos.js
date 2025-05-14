document.addEventListener('DOMContentLoaded', function() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=409394297&single=true&output=csv';
    const molinosContent = document.getElementById('molinos-content');
    const loadingIndicator = document.getElementById('loading-molinos');

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la información de tarifas');
            return response.text();
        })
        .then(csv => {
            try {
                renderTarifasTranspuesta(csv);
                loadingIndicator.style.display = 'none';
            } catch (error) {
                throw error;
            }
        })
        .catch(error => {
            console.error('Error al cargar las tarifas:', error);
            loadingIndicator.style.display = 'none';
            molinosContent.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    Error: ${error.message}
                    <br>
                    Por favor, intente nuevamente más tarde o contáctenos directamente.
                </div>
            `;
        });

    function renderTarifasTranspuesta(csv) {
        const lines = csv.trim().split('\n').filter(l => l.trim());
        if (lines.length < 2) throw new Error('Formato de datos incorrecto');

        // Cabeceras: Temporada, 1 o 2, 3, 4, 5, 6, fecha
        const headers = lines[0].split(',').map(h => h.trim());
        const pasajeros = headers.slice(1, 6); // ['1 o 2 Pax', '3 Pax', ...]
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
            const temporada = row[0].toLowerCase();
            if (!temporadas.includes(temporada)) continue;

            pasajeros.forEach((pax, idx) => {
                if (!preciosPorPasajero[pax]) preciosPorPasajero[pax] = {};
                preciosPorPasajero[pax][temporada] = row[idx + 1] ? `AR$ ${row[idx + 1]}` : '-';
            });

            if (!fechaActualizacion && row[6]) fechaActualizacion = row[6];
        }

        // Construir tabla transpuesta
        let tableHtml = `
            <div class="table-responsive">
                <table class="table table-tarifas">
                    <thead>
                        <tr>
                            <th>Pasajeros</th>
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
                <small class="actualizacion-fecha">Última actualización: ${fechaActualizacion || 'No disponible'}</small>
            </div>`;

        molinosContent.innerHTML = tableHtml;
    }
});