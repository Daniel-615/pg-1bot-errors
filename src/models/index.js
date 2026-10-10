const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');

class Database {
    constructor() {
        this._sequelize = new Sequelize(
            dbConfig.DB,
            dbConfig.USER,
            dbConfig.PASSWORD,
            {
                host: dbConfig.HOST,
                dialect: dbConfig.dialect,
                port: dbConfig.DB_PORT,
                pool: dbConfig.pool,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false
            }
        );

        this.Sequelize = Sequelize;
        this.models = {};

        this._loadModels();
        this._associateModels();
    }

    _loadModels() {
        const sequelize = this._sequelize;
        this.models.errors = require('./errors.js')(sequelize);
        this.models.error_type = require('./type.error.js')(sequelize);
        this.models.evaluation = require('./evaluation.js')(sequelize);

    }

    _associateModels() {
        const {
            errors,
            error_type,
            evaluation
        } = this.models;
        error_type.hasMany(errors,{
            foreignKey: "id_tipo_error",
            as: "errores"
        });
        errors.belongsTo(error_type,{
            foreignKey: "id_tipo_error",
            as: "tipo_error"
        });
    }
    get sequelize() {
        return this._sequelize;
    }

    getModel(name) {
        return this.models[name];
    }
}

module.exports = new Database();
