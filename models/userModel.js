// userModel.js

const conexion = require('../database/db');

exports.getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        conexion.query('SELECT * FROM users', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
