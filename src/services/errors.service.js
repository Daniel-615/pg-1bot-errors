const db = require("../models");

const errorsModel = db.getModel("errors");
const typeErrorsModel = db.getModel("error_type");

class ErrorsService {
    async get(id_usuario) {
        try {
            const errors = await errorsModel.findAll({
                where: {
                    id_usuario
                },
                include: [
                    {
                        model: typeErrorsModel,
                        as: 'tipo_error',
                        required: true
                    },
                ]
            })
            return {
                ok: true,
                data: errors
            };
        }catch(err){
            return {
                ok: false, 
                message: "Error al obtener los errores asociados al usuario"
            }
        }
    }
    async create(id_usuario, id_tipo_error, nombre_programa, bloque, edad) {
        try {
            const error = await errorsModel.create({
                id_usuario,
                id_tipo_error,
                nombre_programa,
                bloque,
                edad
            });

            return {
                ok: true,
                data: error
            };

        } catch (err) {
            return {
                ok: false,
                message: "Error al crear el error",
            };
        }
    }
}

module.exports = new ErrorsService();
