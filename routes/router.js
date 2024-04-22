const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const geminiController = require("../controllers/geminiController");

// Middleware para verificar el rol de usuario
const checkRole = (requiredRole) => (req, res, next) => {
    if (!req.user || req.user.role_id !== requiredRole) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

router.get('/', authController.isAuthenticated, async (req, res) => {
    try {
        const users = await authController.getAllUsers();
        console.log(users); // Agrega este console.log para verificar si `users` se está recibiendo correctamente
        if (req.user) {
            if (req.user.role_id === 1) {
                // Redirigir al usuario regular a su vista
                return res.render('user', { user: req.user });
            } else if (req.user.role_id === 2) {
                // Redirigir al administrador a su vista
                return res.render('admin', { user: req.user });
            } else if (req.user.role_id === 3) {
                // Redirigir al superadmin a su vista
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

// Ruta para asignar roles
router.post('/assign-role', authController.isAuthenticated, checkRole(3), authController.assignRole);

// Rutas para los métodos del controlador
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post("/consultar", geminiController.consultar);


module.exports = router;