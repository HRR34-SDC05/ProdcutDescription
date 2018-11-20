const { Client } = require('pg');
const chalk = require('chalk');

const config = require('../config.json')
const { generateRandomDescription } = require('./generateSampleRecords.js');

// ------------------ Connect to PG ------------------ //
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

// ------------------ Query Builder ------------------ //
const buildQuery = (insertStatement, records) => {
  const params = [];
  const chunks = [];
  records.forEach(record => {
    const valueClause = []
    Object.keys(record).forEach(param => {
      params.push(record[param])
      valueClause.push('$' + params.length)
    })
    chunks.push('(' + valueClause.join(', ') + ')')
  })
  return {
    text: insertStatement + chunks.join(', '),
    values: params
  }
}

// ------------------ Insert X Records Into PG ------------------ //
const insertRecords = async (idStart, idEnd) => {
  return new Promise((resolve, reject) => {
    let generatedRecords = [];
    for (let i = idStart; i <= idEnd ; i++) {
      generatedRecords.push(generateRandomDescription(i));
    }
    resolve(client.query(buildQuery(`INSERT INTO ${table} (${fields}) VALUES `, generatedRecords))
      .catch(err => console.error(chalk.red(`There was an error! --> `), err)));
  })
}

// ------------------ Create A Batch Of Records ------------------ //
const createAPGBatch = async (totalRecordCount, batchCount) => {
  // Max recommended batch is 10,000 records;
  console.time('BatchRun')
  let batchSize = Math.floor(totalRecordCount / batchCount);
  let start = 1;
  let end = batchSize;
  for (let i = 0; i < batchCount; i++) {
    await insertRecords(start, end)
    start = end + 1;
    end += batchSize;
  }
  console.timeEnd('BatchRun');
  console.log(`The BatchRun added ${totalRecordCount} records in ${batchCount} batches.`);
  client.end();
}

 createAPGBatch(100, 1)

module.exports.insertRecords = insertRecords;
module.exports.createAPGBatch = createAPGBatch;
