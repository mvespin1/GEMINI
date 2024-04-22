// roleModel.js

const conexion = require('../database/db');

exports.getAllRoles = async () => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM roles', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
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
