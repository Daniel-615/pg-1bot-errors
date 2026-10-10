const { DataTypes } = require("sequelize");

module.exports = (sequelize) => sequelize.define("Evaluation", {
    id_evaluacion: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    id_usuario: { type: DataTypes.UUID, allowNull: false },
    momento: { type: DataTypes.ENUM("pretest", "postest"), allowNull: false },
    puntuacion: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    puntuacion_maxima: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    instrumento: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "Evaluación de programación" },
    duracion_segundos: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0 } },
    intentos: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1, validate: { min: 1 } },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { tableName: "evaluaciones", updatedAt: false });
