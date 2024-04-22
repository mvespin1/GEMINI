// authenticationService.js

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { promisify } = require('util');
const conexion = require('../database/db');

exports.registerUser = async (name, user, pass, role_id) => {
    const passHash = await bcryptjs.hash(pass, 8);
    return new Promise((resolve, reject) => {
        conexion.query('INSERT INTO users SET ?', { user, name, pass: passHash, role_id }, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

exports.loginUser = async (user, pass) => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                reject({ message: 'Invalid credentials' });
            } else {
                const { id, role_id } = results[0];
                const token = jwt.sign({ id, role_id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                });
                resolve(token);
            }
        });
    });
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else if (!results) {
                    return next();
                } else {
                    req.user = results[0];
                    return next();
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.redirect('/login');
    }
}
