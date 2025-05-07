document.addEventListener('DOMContentLoaded', function() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=409394297&single=true&output=csv';
    const molinosContent = document.getElementById('molinos-content');
    const loadingIndicator = document.getElementById('loading-molinos');

    // Cargar y procesar los datos
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la información de tarifas');
            return response.text();
        })
        .then(csv => {
            try {
                const { fechaActualizacion, temporadas } = procesarDatosCSV(csv);
                molinosContent.innerHTML = crearTabla(fechaActualizacion, temporadas);
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

    // Función para procesar los datos CSV
    function procesarDatosCSV(csv) {
        const lineas = csv.trim().split('\n').filter(linea => linea.trim());

        if (lineas.length < 2) throw new Error('Formato de datos incorrecto');

        // Extraer la fecha de actualización de la primera fila de datos
        const primeraFila = lineas[1].split(',');
        const fechaActualizacion = primeraFila[6] || 'No disponible';

        // Mapear temporadas
        const temporadas = {};
        for (let i = 1; i < lineas.length; i++) {
            const fila = lineas[i].split(',');
            const temporada = fila[0].toLowerCase();

            if (temporada.includes('baja')) temporadas.baja = fila;
            else if (temporada.includes('media')) temporadas.media = fila;
            else if (temporada.includes('alta')) temporadas.alta = fila;
        }

        return { fechaActualizacion, temporadas };
    }

    // Función para crear la tabla HTML
    function crearTabla(fechaActualizacion, temporadas) {
        // Definir tipos de temporada
        const tiposTemporada = [
            { key: 'baja', nombre: 'BAJA', clase: 'temporada-baja' },
            { key: 'media', nombre: 'MEDIA', clase: 'temporada-media' },
            { key: 'alta', nombre: 'ALTA', clase: 'temporada-alta' }
        ];

        // Crear filas de temporadas
        const filas = tiposTemporada
            .filter(tipo => temporadas[tipo.key])
            .map(tipo => {
                const datos = temporadas[tipo.key];
                const celdas = [];

                // Crear celdas para precios (índices 1-5)
                for (let i = 1; i <= 5; i++) {
                    celdas.push(`<td>$${datos[i]} USD</td>`);
                }

                return `
                    <tr>
                        <td class="${tipo.clase}">${tipo.nombre}</td>
                        ${celdas.join('')}
                    </tr>
                `;
            }).join('');

        // Construir tabla completa
        return `
            <div class="table-responsive">
                <table class="table table-tarifas">
                    <thead>
                        <tr>
                            <th>Temporada</th>
                            <th>1 o 2 Pax</th>
                            <th>3 Pax</th>
                            <th>4 Pax</th>
                            <th>5 Pax</th>
                            <th>6 Pax</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>
            <div class="actualizacion-container">
                <small class="actualizacion-fecha">Última actualización: ${fechaActualizacion}</small>
            </div>
        `;
    }
});