const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        await authService.register(req.body);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.login = async (req, res) => {
    try {
        await authService.login(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.isAuthenticated = async (req, res, next) => {
    try {
        await authService.isAuthenticated(req, res, next);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.assignRole = async (req, res) => {
    try {
        await authService.assignRole(req.body.userId, req.body.roleId);
        res.redirect('/superadmin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.getSuperadminPage = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.render('superadmin', { user: req.user, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
}
