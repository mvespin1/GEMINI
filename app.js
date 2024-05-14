const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

dotenv.config({ path: './env/.env' });

const app = express();

// Importar la conexión a la base de datos
const connection = require('./database/db');

// Seteamos el motor de plantillas
app.set('view engine', 'ejs');

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Para poder trabajar con las cookies
app.use(cookieParser());

// Llamar al router
app.use('/', require('./routes/router'));

// Para eliminar la cache
app.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use(cors());
app.use(bodyParser.json());

// Endpoint para obtener todas las preguntas
app.get('/api/preguntas', (req, res) => {
    const query = 'SELECT * FROM preguntas';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json({ data: results });
    });
});

// Endpoint para crear una nueva pregunta
app.post('/api/preguntas', (req, res) => {
    const { pregunta, respuesta } = req.body;
    const query = 'INSERT INTO preguntas (pregunta, respuesta) VALUES (?, ?)';
    connection.query(query, [pregunta, respuesta], (error, results) => {
        if (error) throw error;
        res.json({ id: results.insertId });
    });
});

// Endpoint para actualizar una pregunta existente
app.put('/api/preguntas/:id', (req, res) => {
    const { id } = req.params;
    const { pregunta, respuesta } = req.body;
    const query = 'UPDATE preguntas SET pregunta = ?, respuesta = ? WHERE id = ?';
    connection.query(query, [pregunta, respuesta, id], (error, results) => {
        if (error) throw error;
        res.sendStatus(200);
    });
});

// Endpoint para eliminar una pregunta
app.delete('/api/preguntas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM preguntas WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (error) throw error;
        res.sendStatus(200);
    });
});

app.listen(3000, () => {
    console.log('SERVER UP running in http://localhost:3000');
});
