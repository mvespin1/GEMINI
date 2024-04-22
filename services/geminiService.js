const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const stringSimilarity = require("string-similarity");


const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyA0Mn-EPfV0et4KfzwY_DWqANugwyGZHXk"; // Reemplaza TU_CLAVE_API con tu clave API

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
    
    const preguntasPredeterminadas = {
        "que es el incetivo tributario": "Es un mecanismo fiscal que incentiva al sector privado a invertir en deporte, a través del beneficio de la deducción del 150% adicional al cálculo del impuesto a la renta de gastos de publicidad y patrocinio a favor del deporte.",
        "en donde realizo el tramite para acceder al incentivo tributario en beneficio del deporte": "El Ministerio del Deporte es la entidad encargada de gestionar estas solicitudes para lo que ha implementado un aplicativo digital disponible en la página web: www.deporte.gob.ec El artículo 32 del Acuerdo Ministerial Nro. 434 establece lo siguiente: “De las solicitudes de calificación de prioridad. – Las solicitudes de calificación de prioridad de programas y/o proyectos deportivos cuya ejecución corresponda a uno o varios años, serán dirigidas al Ministerio del Deporte desde el primer día hábil del correspondiente ejercicio fiscal, hasta el 15 de diciembre del mismo año. Los programas y/o proyectos presentados fuera de estas fechas no serán considerados para el proceso de Calificación.        De igual manera el artículo 33 del Acuerdo Ministerial Nro. 434 señala lo siguiente: “De la tramitación electrónica de las solicitudes de calificación: El trámite de calificación de prioridad de un programa y/o proyecto deportivo será electrónico, incluidas las notificaciones, observaciones y/o aprobaciones que se generen hasta su total culminación. El término para la ejecución del proceso será de treinta (30) días contados desde la fecha de presentación de la solicitud o desde la fecha de la última subsanación de observaciones, según corresponda. En atención a lo mencionado en el inciso precedente, el/la solicitante deberá consignar una dirección de correo electrónico para notificaciones, y cargar a través del aplicativo informático todos los documentos que conforman el expediente, los cuales deberán contener la respectiva firma electrónica. No se procesarán aquellas solicitudes que contengan firmas manuales, sobrepuestas o escaneadas.",
        "quienes puede acceder al incentivo tributario y deducir hasta el 150 adicional en el calculo del impuesto a la renta": "Personas naturales o jurídicas que sean contribuyentes régimen general que patrocinen o inviertan en programas o proyectos deportivos calificados por el Ministerio del Deporte.",
        "quienes no pueden acceder al al incentivo tributario y deducir hasta el 150 adicional en el calculo del impuesto a la renta": "Personas Naturales o Jurídicas que sean contribuyentes régimen RIMPE Popular o RIMPE Emprendedor. De igual forma No podrán deducirse los costos y gastos por promoción y publicidad aquellos contribuyentes que comercialicen alimentos preparados con contenido hiperprocesado. Los criterios de definición para ésta y otras excepciones que se establecen en la Ley de Régimen Tributario Interno y su Reglamento.",
    };

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
