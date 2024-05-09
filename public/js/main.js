const PreguntasModel = require("../../PreguntasModel");

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
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
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

    await listUsers();

    dataTable = $("#example").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

const listUsers = async () => {
    try {
        const data = await PreguntasModel.obtenerTodaLaTabla();

        let content = ``;
        data.forEach((row, index) => {
            content += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.pregunta}</td>
                    <td>${row.respuesta}</td>
                </tr>`;
        });
        $("#datatable_users").html(content);

        if (dataTableIsInitialized) {
            dataTable.draw();
        }
    } catch (ex) {
        alert(ex);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();

    setInterval(initDataTable, 5000);
});
