// middleware/checkRoleMiddleware.js

const checkRole = (requiredRole) => (req, res, next) => {
    if (!req.user || req.user.role_id !== requiredRole) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

module.exports = checkRole;
