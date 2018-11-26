const chalk = require('chalk');

const client = require('../connectPg');
const { table, fields } = require('../describePg');
const { generateRandomDescription } = require('./generateSampleRecords.js');

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
const insertPGRecords = async (idStart, idEnd) => {
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
  client.connect();
  console.time('BatchRun')
  let batchSize = Math.floor(totalRecordCount / batchCount);
  let start = 1;
  let end = batchSize;
  for (let i = 0; i < batchCount; i++) {
    await insertPGRecords(start, end)
    start = end + 1;
    end += batchSize;
  }
  console.timeEnd('BatchRun');
  console.log(chalk.green(`The BatchRun added ${totalRecordCount} records in ${batchCount} batches.`));
  client.end();
}

//Example Use:
// createAPGBatch(10000000, 1000)
// Adds 10m records to Postgres in 1000 batches of 10,000;

module.exports.createAPGBatch = createAPGBatch;
