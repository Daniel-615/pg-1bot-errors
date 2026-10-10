class TypeErrorController {
    constructor() {
        try {
            this.typeErrorsService = require("../services/type.errors.service");
        } catch (err) {
            console.error(
                "No se pudo importar el servicio de tipo de errores"
            )
        }
    }
    async getTypeError(req, res) {
        try {
            const result = await this.typeErrorsService.get();
            if (!result.ok) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: result.message
                    })
            }
            return res
                .status(200)
                .json({
                    result
                })
        } catch (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "Error interno del servidor"
                })
        }
    }
    async createTypeError(req, res) {
        try {
            const {
                message,
                severity
            } = req.body;
            if (!message || !severity) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message: "Datos requeridos:'message' y 'severity'"
                    })
            }
            const result = await this.typeErrorsService.create(
                message,
                severity
            )
            if (!result.ok) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: result.message
                    })
            }
            return res
                .status(201)
                .json({
                    ok: true,
                    message: "Tipo de error creado exitosamente"
                })
        } catch (err) {
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "Error interno del servidor"
                })
        }
    }
}
module.exports = new TypeErrorController;