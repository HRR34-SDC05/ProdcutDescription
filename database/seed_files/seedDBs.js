const { createAPGBatch } = require('./seedPg');
const { createAMongoBatch } = require('./seedMongo');

let recordCount = 10000000;
let batches = 1000;
createAMongoBatch(recordCount, batches);
createAPGBatch(recordCount, batches);