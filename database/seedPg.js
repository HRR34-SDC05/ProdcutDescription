const faker = require('faker');
const { Writable, Readable, Transform, Duplex } = require('stream');
// const copyFrom = require('pg-copy-streams').from;
const { Client } = require('pg');
// const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
// const { flatten, unflatten } = require('flat');
const chalk = require('chalk');

const config = require('../config.json')
const { generateRandomDescription } = require('./generateSampleRecords.js');

// parallel instances of node -

// --------- Connect to PG --------- //
const table = 'descriptions';
const fields = 'product_id, product_name, features, tech_specs'
const host = config.host;
const user = config.username;
const pw = config.password;
const db = config.database;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
});
client.connect();
// ----------------------------------//

// ------------------ Insert X Records Into PG ------------------ //

const insertRecords = async (idStart, idEnd, batchCount = 1) => {
  console.time('Insert Records to PG')
  let batchSize = Math.floor((idEnd - idStart)/batchCount);
  let start = idStart;
  let end = start + batchSize;
  for (let i = 0; i <= batchCount; i++) {
    // console.log(chalk.green(`The current batch is ${i}`));
    // console.log(`The starting ID is ${start} and ending ID is ${end}`);
    for (let i = start; i <= end ; i++) {
      let record = generateRandomDescription(i)
      const insertQueryText = `INSERT INTO ${table} (${fields}) VALUES ($1, $2, $3, $4) RETURNING *`;
      const insertQueryValues = [record.productId, record.productName, record.features, record.techSpecs];
      client.query(insertQueryText, insertQueryValues)
      // .then(res => console.log(res))
      .catch(err => console.error(chalk.red(`There was an error! --> `), err))
    }
    start = end + 1;
    end += batchSize;
  }
  console.timeEnd('Insert Records to PG');
}

// -------------------------------------------------------------- //

insertRecords(1, 100000, 1000)

module.exports.insertRecords = insertRecords;
