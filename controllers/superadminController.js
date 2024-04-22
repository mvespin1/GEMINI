// superadminController.js

const userModel = require('../models/userModel');
const roleService = require('../services/roleService');

exports.getSuperadminPage = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.render('superadmin', { user: req.user, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.assignRole = async (req, res) => {
    try {
        const userId = req.body.userId;
        const roleId = req.body.roleId;

        // Verificamos si el usuario y el rol existen
        const userExists = await roleService.getUserById(userId);
        const roleExists = await roleService.getRoleById(roleId);

        if (!userExists || !roleExists) {
            return res.status(404).json({ error: 'Usuario o rol no encontrado' });
        }

        // Actualizamos el rol del usuario en la base de datos
        await roleService.updateUserRole(userId, roleId);

        res.redirect('/superadmin'); // Redireccionar después de actualizar el rol
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
