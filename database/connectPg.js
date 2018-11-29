const { Client } = require('pg');
const config = require('../config.json')

const environment = "production" // options are 'development' or 'production'

const host = config[environment].host;
const user = config[environment].username;
const pw = config[environment].password;
const db = config[environment].database;
const port = config[environment].port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
});

module.exports = client;

