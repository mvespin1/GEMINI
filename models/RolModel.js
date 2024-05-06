const conexion = require('../database/db');

class RolModel {
    static async findById(roleId) {
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
