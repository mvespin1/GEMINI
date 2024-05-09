// routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const geminiController = require("../controllers/geminiController");
const preguntasModel = require("../models/PreguntasModel");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/assign-role', authController.isAuthenticated, checkRole(3), authController.assignRole);


router.get('/admin', authController.isAuthenticated, async (req, res) => {
    try {
        res.render('admin', { user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener los datos de las preguntas mediante AJAX
router.get('/api/preguntas', authController.isAuthenticated, async (req, res) => {
    try {
        const preguntas = await preguntasModel.obtenerTodaLaTabla();
        res.json({ data: preguntas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/', authController.isAuthenticated, async (req, res) => {
    try {
        const users = await authController.getAllUsers();
        console.log(users);
        if (req.user) {
            if (req.user.role_id === 1) {
                return res.render('user', { user: req.user });
            } else if (req.user.role_id === 2) {
                return res.render('admin', { user: req.user });
            } else if (req.user.role_id === 3) {
                return res.render('superadmin', { user: req.user, users });
            }
        }
        res.render('error', { message: 'Rol de usuario desconocido' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post("/consultar", geminiController.consultar);

module.exports = router;
