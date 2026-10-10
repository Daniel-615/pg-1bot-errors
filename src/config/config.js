require("dotenv").config();

const {
    DB_PORT,
    HOST,
    USER,
    PASSWORD,
    PORT,
    DB,
    SECRET_JWT_KEY
} = process.env;

module.exports = {
    PORT,
    HOST,
    USER,
    PASSWORD,
    DB,
    DB_PORT,
    SECRET_JWT_KEY
};
