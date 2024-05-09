// PreguntasModel.js

const conexion = require('../database/db'); 

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

async function obtenerTodaLaTabla() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM preguntas";
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
    obtenerPreguntasYRespuestas,
    obtenerTodaLaTabla
};
