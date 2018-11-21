const chalk = require('chalk');

const db = require('../connectMongo.js');
const Description  = require('../describeMongo.js');
const { generateRandomDescription } = require ('./generateSampleRecords.js')

// ------------------ Query Builder ------------------ //
const buildQuery = (recordstoCreate) => {
  return recordstoCreate.map((record) => {return {insertOne: {document : record}}})
}

// ------------------ Insert X Records Into Mongo ------------------ //
const insertMongoRecords = async function (idStart, idEnd) {
  return new Promise ((resolve, reject) => {
    let generatedRecords = [];
    for (let i = idStart; i <= idEnd; i++) {
      generatedRecords.push(generateRandomDescription(i));
    }
    resolve(Description.bulkWrite(buildQuery(generatedRecords))
      .catch((err) => console.error(chalk.red(`There was an error! -->`), err)))
  })
}

// ------------------ Create A Batch Of Records ------------------ //
const createAMongoBatch = async (totalRecordCount, batchCount) => {
  console.time('BatchRun')
  let batchSize = Math.floor(totalRecordCount / batchCount);
  let start = 1;
  let end = batchSize;
  for (let i = 0; i < batchCount; i++) {
    console.log(`The start value is ${start}, and end is ${end}`)
    await insertMongoRecords(start, end);
    start = end + 1;
    end += batchSize;
  }
  console.timeEnd('BatchRun');
  console.log(`The BatchRun added ${totalRecordCount} records in ${batchCount} batches.`)
  db.close();
}

//Example Use:
// createAMongoBatch(10000000, 1000)
// Adds 10m records to Mongo in 1000 batches of 10,000;

module.exports.createAMongoBatch = createAMongoBatch; 
