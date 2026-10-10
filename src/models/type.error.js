const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    return sequelize.define(
        "TipoError",
        {
            id_tipo_error: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            message: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            severity: {
                type: DataTypes.STRING(10),
                allowNull: false,
            }
        },
        {
            tableName: "tipo_errores",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: false
        }
    );
};