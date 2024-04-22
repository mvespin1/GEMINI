// roleService.js

const conexion = require('../database/db');

exports.getUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.getRoleById = async (roleId) => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM roles WHERE id = ?', [roleId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

exports.updateUserRole = async (userId, roleId) => {
    return new Promise((resolve, reject) => {
        conexion.query('UPDATE users SET role_id = ? WHERE id = ?', [roleId, userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
