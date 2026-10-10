const typeErrorsModel = require("../models").getModel("error_type");
class ErrorsController {
    constructor() {
        try {
            this.errorsService = require("../services/errors.service");
            this.validator = require("../utils/validator")
        } catch (err) {
            console.error(
                "No se pudo importar el servicio de errores"
            );
        }
    }
    async getErrorUser(req, res) {
        const {
            id_usuario,
        } = req.params;
        if (!id_usuario) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: "Datos requeridos 'id_usuario'"
                })
        }
        try {
            const result = await this.errorsService.get(id_usuario);
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
                    ok: true,
                    data: result.data
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
    async createErrorUser(req, res) {
        try {
            const {
                id_usuario
            } = req.params;
            const authenticatedUserId = req.user?.id ?? req.user?.userId ?? req.user?.id_usuario;
            if (authenticatedUserId && authenticatedUserId !== id_usuario) {
                return res.status(403).json({ ok: false, message: "No puedes registrar datos de otro usuario." });
            }
            const {
                nombre_programa,
                bloque,
                edad,
                severity,
                message,
                id_tipo_error
            } = req.body;
            if (
                !id_usuario ||
                !nombre_programa ||
                (!id_tipo_error && (!severity || !message))
            ) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        message:
                            "Datos requeridos: usuario, tipo_error y programa."
                    });
            }

            const validate = this.validator.validateUUID(id_usuario);
            if (!validate.ok) {
                return res
                    .status(400)
                    .json({
                        ok: validate.ok,
                        message: validate.message
                    })
            }
            const typeError = id_tipo_error
                ? await typeErrorsModel.findByPk(id_tipo_error)
                : await typeErrorsModel.findOne({ where: { message, severity } });
            if (!typeError || (edad !== undefined && (!Number.isInteger(Number(edad)) || Number(edad) < 5 || Number(edad) > 120))) {
                return res.status(400).json({
                    ok: false,
                    message: typeError ? "La edad no es válida." : "El tipo de error no está registrado."
                });
            }

            const result =
                await this.errorsService.create(
                    id_usuario,
                    typeError.id_tipo_error,
                    nombre_programa,
                    bloque,
                    edad
                );

            if (!result.ok) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        message: result.message
                    });
            }

            return res
                .status(201)
                .json({
                    ok: true,
                    message: "Error creado exitosamente",
                    data: result.data
                });

        } catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({
                    ok: false,
                    message: "Error interno del servidor"
                });
        }
    }
}

module.exports = new ErrorsController();
