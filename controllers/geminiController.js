const geminiService = require("../services/geminiService");

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
