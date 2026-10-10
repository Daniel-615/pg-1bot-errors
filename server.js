const { PORT } = require("./src/config/config.js");
require("dotenv").config();
class Server {
    constructor() {
        this.express = require("express");
        this.cors = require("cors");

        this.app = this.express();
        this.port = PORT;
        if (!this.port) {
            console.error("No se encuentra el puerto en las variables de entorno")
        }

        try {
            this.db = require("./src/models");
            this.errorsRoutes = require("./src/routes/errors.routes.js");
             this.errorTypeRoutes = require("./src/routes/type.error.routes.js")
             this.evaluationRoutes = require("./src/routes/evaluation.routes.js")
            this.requestLogger = require("./src/middleware/requestLogger.js");

            console.log("Modelos y rutas cargados correctamente");
        } catch (err) {
            console.error("Error", err)

        }

        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    middlewares() {
        this.app.use(this.requestLogger);
        this.app.use(this.cors());
        this.app.use(this.express.json());
    }

    errorHandler() {
        this.app.use((err, req, res, _next) => {
            console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
            res.status(err.status || 500).json({ ok: false, message: "Error interno del servidor." });
        });
    }

    routes() {
        new this.errorsRoutes(this.app);
        new this.errorTypeRoutes(this.app);
        new this.evaluationRoutes(this.app);
    }
    async showTables() {
        try {
            const tables =
                await this.db.sequelize
                    .getQueryInterface()
                    .showAllTables();

            console.log(
                "Tablas en la base de datos:",
                tables
            );
        } catch (err) {
            console.error(err);
        }
    }

    async connectDB() {
        try {
            await this.db.sequelize.sync({ alter: true });

            console.log("Base de datos conectada");

            await this.showTables();
        } catch (err) {
            console.error(err);
        }
    }

    async start() {
        await this.connectDB();

        this.app.listen(this.port, () => {
            console.log(
                `Servidor ejecutándose en puerto ${this.port}`
            );
        });
    }
}

const server = new Server();
server.start();
