// Función para cargar y mostrar las tarifas de Ramayon House
document.addEventListener("DOMContentLoaded", function() {
    // URL del archivo CSV (ajustar a la ubicación real)
    const ramayon_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOJ0rHxM_vXEi_bNKgdzbaHIYFu7bMZo46yhBgnSRXqoQA5sMX8FMkRQnxrhSPg/pub?gid=2087699453&single=true&output=csv';

    // Cargamos los datos
    fetch(ramayon_url)
        .then(response => response.text())
        .then(data => {
            // Procesamos los datos y creamos la tabla
            processRamayonData(data);
        })
        .catch(error => {
            console.error('Error al cargar las tarifas de Ramayon House:', error);
            document.getElementById('loading-ramayon').innerHTML =
                '<p class="text-danger">Error al cargar las tarifas. Por favor, intenta más tarde.</p>';
        });
});

// Función para procesar los datos CSV de Ramayon y crear la tabla
function processRamayonData(csvData) {
    // Dividir el CSV en líneas
    const lines = csvData.split('\n');

    // Extraer la fecha de actualización de la primera fila de datos
    const firstDataRow = lines[1].split(',');
    let fechaActualizacion = firstDataRow[4] || 'No disponible';

    // Crear contenedor para la tabla y la información de actualización
    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-tarifas">
                <thead>
                    <tr>
                        <th>Temporada</th>
                        <th>1-2 Pasajeros</th>
                        <th>3 Pasajeros</th>
                        <th>4 Pasajeros</th>
                    </tr>
                </thead>
                <tbody>`;

    // Procesar cada línea de datos (excepto la cabecera)
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Saltar líneas vacías

        const row = lines[i].split(',');
        if (row.length < 4) continue; // Verificar que la fila tenga datos suficientes

        // Determinar la clase CSS basada en la temporada
        let temporadaClass = '';
        switch (row[0].toLowerCase()) {
            case 'baja':
                temporadaClass = 'temporada-baja';
                break;
            case 'media':
                temporadaClass = 'temporada-media';
                break;
            case 'alta':
                temporadaClass = 'temporada-alta';
                break;
        }

        // Agregar fila a la tabla
        tableHtml += `
            <tr>
                <td class="${temporadaClass}">${row[0].toUpperCase()}</td>
                <td>${row[1].toUpperCase()} ARS</td>
                <td>${row[2].toUpperCase()} ARS</td>
                <td>${row[3].toUpperCase()} ARS</td>
            </tr>`;
    }

    // Cerrar la tabla y agregar la fecha de actualización
    tableHtml += `
                </tbody>
            </table>
        </div>
        <div class="actualizacion-container">
            <small class="actualizacion-fecha">Última actualización: ${fechaActualizacion}</small>
        </div>`;

    // Reemplazar el indicador de carga con la tabla
    document.getElementById('loading-ramayon').style.display = 'none';
    document.getElementById('ramayon-content').innerHTML = tableHtml;
}