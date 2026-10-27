const express = require("express");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");
const controller = require("../controllers/evaluation.controller");

class EvaluationRoutes {
    constructor(app) {
        this.router = express.Router(); 
        this.register(); 
        app.use("/api/evaluations", this.router); 
    }
    register() {
        this.router.use(auth);
        this.router.post("/:id_usuario", requirePermission("crear_evaluaciones"), controller.create.bind(controller));
        this.router.get("/metrics", controller.metricsAll.bind(controller));
        this.router.get("/me/progress", controller.ownProgress.bind(controller));
        this.router.get("/:id_usuario", requirePermission("ver_evaluaciones"), controller.get.bind(controller));
        this.router.get("/:id_usuario/metrics", requirePermission("ver_metricas_evaluacion"), controller.metrics.bind(controller));
    }
}
module.exports = EvaluationRoutes;
