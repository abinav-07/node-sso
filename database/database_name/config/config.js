const dotenv = require('dotenv');

dotenv.config();

const port = process.env.MYSQL_PORT;
const host = process.env.MYSQL_HOST;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DB_NAME;

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: true,
  },
  production: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: true,
  },
};
