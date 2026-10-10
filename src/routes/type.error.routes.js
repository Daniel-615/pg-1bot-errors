const express = require("express");
const typeErrorsController = require("../controllers/type.error.controller");
class TypeErrorsRoute {
    constructor(app) {
        this.router = express.Router();
        this.typeErrorsController = typeErrorsController;
        this.registerRoutes();
        app.use("/api/typeErrors/", this.router);
    }
    registerRoutes() {
        this.router.post(
            "/",
            typeErrorsController.createTypeError.bind(typeErrorsController)
        )
        this.router.get(
            "/",
            typeErrorsController.getTypeError.bind(typeErrorsController)
        )
    }
}
module.exports= TypeErrorsRoute;