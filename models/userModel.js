// UserModel.js
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');

class UserModel {
    static async createUser(name, user, pass, roleId) {
        const passHash = await bcryptjs.hash(pass, 8);
        return new Promise((resolve, reject) => {
            conexion.query('INSERT INTO users SET ?', { user, name, pass: passHash, role_id: roleId }, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }

    static async getByUsername(username) {
        return new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM users WHERE user = ?', [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    static async updateRole(userId, roleId) {
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
}

module.exports = UserModel;
