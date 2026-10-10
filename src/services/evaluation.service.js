const db = require("../models");
const Evaluation = db.getModel("evaluation");

class EvaluationService {
    async create(data) { return Evaluation.create(data); }
    async getByUser(id_usuario) { return Evaluation.findAll({ where: { id_usuario }, order: [["createdAt", "ASC"]] }); }
    async metrics(id_usuario) {
        const rows = await this.getByUser(id_usuario);
        const pretests = rows.filter((row) => row.momento === "pretest");
        const postests = rows.filter((row) => row.momento === "postest");
        const average = (items) => items.length ? items.reduce((sum, row) => sum + Number(row.puntuacion) / Number(row.puntuacion_maxima) * 100, 0) / items.length : null;
        const inicial = average(pretests);
        const final = average(postests);
        return { inicial, final, mejoraPorcentual: inicial !== null && inicial !== 0 && final !== null ? ((final - inicial) / inicial) * 100 : null, muestraPretest: pretests.length, muestraPostest: postests.length };
    }
}
module.exports = new EvaluationService();
