const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const UserModel = require('../models/UserModel');
const RolModel = require('../models/RolModel');

exports.register = async (req, res) => {    
    try {
        const { name, user, pass, role_id } = req.body;
        const userId = await UserModel.createUser(name, user, pass, role_id);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }       
}

exports.login = async (req, res) => {
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
            // Código de manejo de error
        } else {
            const userData = await UserModel.getByUsername(user);
            if (!userData || !(await bcryptjs.compare(pass, userData.pass))) {
                // Código de manejo de error
            } else {
                const { id, role_id } = userData;
                const token = jwt.sign({ id, role_id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                });

                const cookiesOptions = {
                    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };

                res.cookie('jwt', token, cookiesOptions);
                // Código de manejo de éxito
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            const userData = await UserModel.getById(decodificada.id);
            if (!userData) {
                return next();
            } else {
                req.user = userData;
                return next();
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.redirect('/login');        
    }
}

exports.assignRole = async (req, res) => {
    try {
        const userId = req.body.userId;
        const roleId = req.body.roleId;

        // Verificamos si el usuario y el rol existen
        const userExists = await UserModel.getById(userId);
        const roleExists = await RolModel.getById(roleId);

        if (!userExists || !roleExists) {
            return res.status(404).json({ error: 'Usuario o rol no encontrado' });
        }

        // Actualizamos el rol del usuario en la base de datos
        await UserModel.updateRole(userId, roleId);

        res.redirect('/superadmin'); // Redireccionar después de actualizar el rol
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.getSuperadminPage = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers(); // Obtener todos los usuarios de la base de datos
        res.render('superadmin', { user: req.user, users }); // Pasar la lista de usuarios a la vista
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');   
    return res.redirect('/');
}
