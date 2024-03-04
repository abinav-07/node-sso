const dotenv = require("dotenv");

dotenv.config();

const port = process.env.MYSQL_PORT;
const host = process.env.MYSQL_HOST;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DBNAME_AUDIOBEE_DB;

module.exports = {
  "development": {
    username,
    password,
    database,
    host,
    port,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true
    },
    logging: false,
  },
  "production": {
    username,
    password,
    database,
    host,
    port,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true
    },
    logging: false,
  }
}
