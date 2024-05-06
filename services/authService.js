const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');
const UserModel = require('../models/UserModel');
const RolModel = require('../models/RolModel');

exports.register = async ({ name, user, pass, role_id }) => {
    const passHash = await bcryptjs.hash(pass, 8);
    await UserModel.create({ name, user, pass: passHash, role_id });
}

exports.login = async (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        // Handle invalid credentials
    } else {
        const userRecord = await UserModel.findByUsername(user);

        if (!userRecord || !(await bcryptjs.compare(pass, userRecord.pass))) {
            // Handle invalid credentials
        } else {
            const { id, role_id } = userRecord;
            const token = jwt.sign({ id, role_id }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            });

            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie('jwt', token, cookiesOptions);
            // Handle successful login
        }
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            const user = await UserModel.findById(decodificada.id);
            if (!user) {
                return next();
            }
            req.user = user;
            return next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        res.redirect('/login');
    }
}

exports.assignRole = async (userId, roleId) => {
    const user = await UserModel.findById(userId);
    const role = await RolModel.findById(roleId);
    if (!user || !role) {
        throw new Error('Usuario o rol no encontrado');
    }
    await user.updateRole(roleId);
}

exports.getAllUsers = async () => {
    return await UserModel.findAll();
}
