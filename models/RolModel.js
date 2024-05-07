// RolModel.js
const conexion = require('../database/db');

class RolModel {
    static async getById(roleId) {
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
}

module.exports = RolModel;
