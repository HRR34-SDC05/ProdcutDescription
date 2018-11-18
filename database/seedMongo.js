const db = require('./index.js');
const Description  = require('./db.js');
const generateRandomDescription = require ('./generateSampleRecords.js')

// ---------- To Do ---------- //
// 1. Refactor to have batch size and total record count (a la seedPg.js)
// 2. Refactor to do bulkWrite (not .create) -- check Mongoose documentation for appropriate format

const createMongo = (recordsToCreate) => {
  return Description.create(recordsToCreate)
}

const insertToMongo = async function (fileStart, fileEnd) {
  console.time('WriteFilesToMongo')
  for (let i = fileStart; i < fileEnd; i++) {
    let recordsToCreate = await readFromTxt(i)
    await createMongo(recordsToCreate);
  }
  console.timeEnd('WriteFilesToMongo')
  db.close();
}

module.exports.insertToMongo = insertToMongo; 