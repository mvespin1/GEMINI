// Importar el módulo PreguntasModel.js
const PreguntasModel = require('../PreguntasModel');

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    scrollX: true,
    scrollCollapse: true,
    lengthMenu: [5, 10, 15, 20, 50],
    pageLength: 5,
    destroy: true,
    language: {
        lengthMenu: "Mostrar MENU registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de START a END de un total de TOTAL registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde MAX registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listPreguntas(); // Cambiar a listPreguntas()

    dataTable = $("#datatable_preguntas").DataTable(dataTableOptions); // Cambiar a #datatable_preguntas

    dataTableIsInitialized = true;
};

const listPreguntas = async () => { // Cambiar a listPreguntas()
    try {
        const preguntas = await PreguntasModel.obtenerTodaLaTabla(); // Usar obtenerTodaLaTabla() del módulo PreguntasModel

        let content = ``;
        preguntas.forEach((pregunta, index) => { // Iterar sobre las preguntas
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${pregunta.pregunta}</td> <!-- Muestra la pregunta -->
                    <td>${pregunta.respuesta}</td> <!-- Muestra la respuesta -->
                </tr>`;
        });
        tableBody_preguntas.innerHTML = content; // Cambiar a tableBody_preguntas

        if (dataTableIsInitialized) {
            dataTable.draw();
        }
    } catch (ex) {
        alert(ex);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();

    // Renderizar automáticamente la aplicación cada 5 segundos
    setInterval(initDataTable, 5000);
});
