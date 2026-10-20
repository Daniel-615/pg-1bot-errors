const validator = require("../utils/validator");
const service = require("../services/evaluation.service");
const { validateEvaluationInput } = require("../utils/evaluationValidator");

class EvaluationController {
    staffOrAdmin(req) {
        const roles = [
            ...(Array.isArray(req.user?.rol) ? req.user.rol : req.user?.rol ? [req.user.rol] : []),
            ...(Array.isArray(req.user?.roles) ? req.user.roles : []),
        ].map((role) => (typeof role === "string" ? role : role?.nombre || "").trim().toLowerCase().replace(/\s+/g, ""));
        return ["admin", "administrador", "1botpersonal", "personal", "empleado", "profesor", "teacher"].some((role) => roles.includes(role));
    }

    ownUser(req, id_usuario) {
        const authenticatedUserId = req.user?.id ?? req.user?.userId ?? req.user?.id_usuario;
        return !authenticatedUserId || authenticatedUserId === id_usuario;
    }

    async create(req, res) {
        const { id_usuario } = req.params;
        if(!id_usuario){
            return res.status(400).json({ ok: false, message: "El id del usuario es requerido." });
        }
        if (!this.ownUser(req, id_usuario)) return res.status(403).json({ ok: false, message: "No puedes registrar datos de otro usuario." });
        const { momento, puntuacion, puntuacion_maxima, instrumento, duracion_segundos, intentos } = req.body;
        const validation = validateEvaluationInput({ id_usuario, momento, puntuacion, puntuacion_maxima, instrumento, duracion_segundos, intentos });
        if (!validation.valid) {
            return res.status(400).json({ ok: false, message: "Datos de evaluación inválidos." });
        }
        const row = await service.create(validation.data);
        return res.status(201).json({ ok: true, data: row });
    }
    async get(req, res) {
        if (!validator.validateUUID(req.params.id_usuario).ok) return res.status(400).json({ ok: false, message: "El id del usuario no es válido." });
        if (!this.ownUser(req, req.params.id_usuario)) return res.status(403).json({ ok: false, message: "No puedes consultar datos de otro usuario." });
        const rows = await service.getByUser(req.params.id_usuario);
        return res.json({ ok: true, data: rows });
    }
    async metrics(req, res) {
        if (!validator.validateUUID(req.params.id_usuario).ok) return res.status(400).json({ ok: false, message: "El id del usuario no es válido." });
        if (!this.ownUser(req, req.params.id_usuario)) return res.status(403).json({ ok: false, message: "No puedes consultar métricas de otro usuario." });
        return res.json({ ok: true, data: await service.metrics(req.params.id_usuario) });
    }
    async metricsAll(req, res) {
        if (!this.staffOrAdmin(req)) return res.status(403).json({ ok: false, message: "Solo el personal y los administradores pueden consultar métricas globales." });
        const ageMin = req.query.edadMin === undefined ? null : Number(req.query.edadMin);
        const ageMax = req.query.edadMax === undefined ? null : Number(req.query.edadMax);
        if ((ageMin !== null && (!Number.isInteger(ageMin) || ageMin < 5 || ageMin > 120)) || (ageMax !== null && (!Number.isInteger(ageMax) || ageMax < 5 || ageMax > 120)) || (ageMin !== null && ageMax !== null && ageMin > ageMax)) {
            return res.status(400).json({ ok: false, message: "El rango de edad no es válido." });
        }
        return res.json({ ok: true, data: await service.metricsAll({ ageMin, ageMax }) });
    }
}
module.exports = new EvaluationController();
