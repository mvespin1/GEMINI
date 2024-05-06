const conexion = require('../database/db');

class UserModel {
    static async create({ name, user, pass, role_id }) {
        return new Promise((resolve, reject) => {
            conexion.query('INSERT INTO users SET ?', { user, name, pass, role_id }, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async findByUsername(username) {
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

    static async findById(userId) {
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

    async updateRole(roleId) {
        // Implement update role logic
    }

    static async findAll() {
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
}

module.exports = UserModel;
