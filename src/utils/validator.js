const validator= require("validator")
class Validator{
    validateUUID(pattern){
        if(!validator.isUUID(pattern)){
            return {
                ok: false,
                message: "El campo debe ser un uuid válido"
            }
        }
        return { ok: true };
    }
}
module.exports= new Validator();
