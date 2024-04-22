const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');

exports.register = async (req, res) => {    
    try {
        const { name, user, pass, role_id } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);
        
        conexion.query('INSERT INTO users SET ?', { user, name, pass: passHash, role_id }, (error, results) => {
            if(error) {
                console.log(error);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }       
}

exports.login = async (req, res) => {
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
                } else {
                    const { id, role_id } = results[0];
                    const token = jwt.sign({ id, role_id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };

                    res.cookie('jwt', token, cookiesOptions);
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡Inicio de sesión correcto!",
                        alertIcon:'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    });
                }
            });
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
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error interno del servidor' });
                } else if (!results) {
                    return next();
                } else {
                    req.user = results[0];
                    return next();
                }
            });
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
        const userExists = await getUserById(userId);
        const roleExists = await getRoleById(roleId);

        if (!userExists || !roleExists) {
            return res.status(404).json({ error: 'Usuario o rol no encontrado' });
        }

        // Actualizamos el rol del usuario en la base de datos
        await updateUserRole(userId, roleId);

        res.redirect('/superadmin'); // Redireccionar después de actualizar el rol
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para obtener un usuario por su ID
async function getUserById(userId) {
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

// Función para obtener un rol por su ID
async function getRoleById(roleId) {
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

// Función para actualizar el rol de un usuario
async function updateUserRole(userId, roleId) {
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

exports.getSuperadminPage = async (req, res) => {
    try {
        const users = await getAllUsers(); // Obtener todos los usuarios de la base de datos
        res.render('superadmin', { user: req.user, users }); // Pasar la lista de usuarios a la vista
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Función para obtener todos los usuarios de la base de datos
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

exports.logout = (req, res) => {
    res.clearCookie('jwt');   
    return res.redirect('/');
}
