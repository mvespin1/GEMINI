// geminiService.js

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const stringSimilarity = require("string-similarity");
const PreguntasModel = require("../models/PreguntasModel"); // Reemplaza './PreguntasModel' con la ubicación de tu archivo PreguntasModel

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyA9H7RvotEM_gffguwwhXK07C5bH9GSxFM"; // Reemplaza TU_CLAVE_API con tu clave API

async function consultarGEMINI(consulta) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // Obtener preguntas y respuestas de la base de datos
    const preguntasYRespuestas = await PreguntasModel.obtenerPreguntasYRespuestas(); // Cambia el nombre de la función

    // Crear objeto de preguntas predeterminadas
    const preguntasPredeterminadas = {};
    preguntasYRespuestas.forEach(({ pregunta, respuesta }) => {
        preguntasPredeterminadas[pregunta.toLowerCase()] = respuesta;
    });

    const consultaNormalizada = consulta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, "");

    // Verificar si la consulta coincide con alguna pregunta predeterminada
    if (preguntasPredeterminadas.hasOwnProperty(consultaNormalizada)) {
        return preguntasPredeterminadas[consultaNormalizada];
    } else {
        // Calcular similitud entre la consulta y las preguntas predeterminadas
        const keys = Object.keys(preguntasPredeterminadas);
        const similarities = keys.map(key => ({
            pregunta: key,
            similitud: stringSimilarity.compareTwoStrings(consultaNormalizada, key)
        }));

        // Ordenar por similitud descendente
        similarities.sort((a, b) => b.similitud - a.similitud);

        // Comprobar si la similitud supera el 60%
        if (similarities[0].similitud >= 0.6) {
            return preguntasPredeterminadas[similarities[0].pregunta];
        } else {
            // Generar respuesta utilizando el modelo GPT-3
            const parts = [{ text: consulta }];
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
            });
            return result.response.text();
        }
    }
}

module.exports = {
    consultarGEMINI,
};