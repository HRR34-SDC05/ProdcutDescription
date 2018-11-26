const { Client } = require('pg');

const config = require('../config.json')

const host = config.host;
const user = config.username;
const pw = config.password;
const db = config.database;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
});

module.exports = client;

