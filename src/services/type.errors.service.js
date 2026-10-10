const db = require("../models");

const typeErrorsModel = db.getModel("error_type");

class TypeErrorsService {
    async get() {
        try {
            const typeErrors = await typeErrorsModel.findAll({
            })
            if (!typeErrors) {
                return {
                    ok: false,
                    message: "No se encontraron tipos de errores"
                }
            }
            return {
                ok: true,
                message: "Se han encontrado tipo de errores",
                data: typeErrors
            }
        } catch (err) {
            console.log(err)
            return {
                ok: false,
                message: "Error al obtener los tipos de errores"
            }
        }
    }
    async create(message, severity) {
        try {
            const typeError = await typeErrorsModel.create({
                message,
                severity
            });

            return {
                ok: true,
                data: typeError
            };

        } catch (err) {
            console.log(err)
            return {
                ok: false,
                message: "Error al crear el tipo de error",
            };
        }
    }
}

module.exports = new TypeErrorsService();