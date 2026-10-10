function requirePermission(permission) {
    return (req, res, next) => {
        const permissions = Array.isArray(req.user?.permisos) ? req.user.permisos : [];
        if (!permissions.includes(permission)) {
            return res.status(403).json({ ok: false, message: "No tienes permiso para realizar esta operación.", requiredPermission: permission });
        }
        next();
    };
}

module.exports = requirePermission;
