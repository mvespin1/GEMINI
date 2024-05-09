const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path'); // Importar el módulo path

const app = express()

//seteamos el motor de plantillas
app.set('view engine', 'ejs')

//seteamos la carpeta public para archivos estáticos
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views')); // Directorio de vistas

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/', require('./routes/router'))

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


app.listen(3000, ()=>{
    console.log('SERVER UP runnung in http://localhost:3000')
})
// Ruta para obtener los datos desde la base de datos
app.get('/obtenerDatos', (req, res) => {
    connection.query('SELECT * FROM preguntas', (error, results) => {
        if (error) throw error;
        res.json(results); // Enviar los resultados como JSON al cliente
    });
});