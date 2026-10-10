const express = require("express");
const errorsController= require("../controllers/errors.controller");
const auth = require("../middleware/auth");
class ErrorsRoute{
    constructor(app){
        this.router=express.Router();
        this.errorsController= errorsController;
        this.registerRoutes();
        app.use("/api/errors/",this.router);

    }
    registerRoutes(){
        this.router.post(
            "/:id_usuario",
            auth,
            errorsController.createErrorUser.bind(errorsController)
        );
        this.router.get("/:id_usuario", auth, errorsController.getErrorUser.bind(errorsController));
    }
}
module.exports= ErrorsRoute;
