const jwt = require("jsonwebtoken");
const { SECRET_JWT_KEY } = require("../config/config.js");

module.exports = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token || !SECRET_JWT_KEY) return res.status(401).json({ ok: false, message: "No autorizado." });
    try {
        req.user = jwt.verify(token, SECRET_JWT_KEY);
        next();
    } catch {
        return res.status(401).json({ ok: false, message: "Token inválido." });
    }
};
