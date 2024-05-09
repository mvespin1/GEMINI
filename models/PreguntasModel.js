// PreguntasModel.js

const conexion = require('../database/db'); // Reemplaza './conexion' con la ubicación de tu archivo de conexión

async function obtenerPreguntasYRespuestas() {
    return new Promise((resolve, reject) => {
        const query = "SELECT pregunta, respuesta FROM preguntas";
        conexion.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    obtenerPreguntasYRespuestas
};
