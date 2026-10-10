const validator = require("../utils/validator");
const service = require("../services/evaluation.service");
const { validateEvaluationInput } = require("../utils/evaluationValidator");

class EvaluationController {
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
}
module.exports = new EvaluationController();
