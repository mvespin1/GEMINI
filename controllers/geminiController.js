const geminiService = require("../services/geminiService");
const preguntasModel = require("../models/PreguntasModel");

exports.consultar = async (req, res) => {
    try {
        const preguntas = await preguntasModel.obtenerTodaLaTabla();
        res.json({ data: preguntas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function consultar(req, res) {
    try {
        const consulta = req.body.consulta;
        const resultado = await geminiService.consultarGEMINI(consulta);
        res.render("resultado", { resultado });
    } catch (error) {
        console.error("Error en la consulta GEMINI:", error);
        res.status(500).send("Error en la consulta GEMINI.");
    }
}

module.exports = {
    consultar,
};
