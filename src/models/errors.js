const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "Error",
        {
            id_error: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            id_usuario: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            edad: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: { min: 5, max: 120 },
            },

            id_tipo_error: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            nombre_programa: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            bloque: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            tableName: "errores",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: false,
        }
    );
};
