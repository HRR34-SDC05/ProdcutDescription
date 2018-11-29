const { createAPGBatch } = require('./seedPg');

let recordCount = 10000000;
let batches = 1000;
createAPGBatch(recordCount, batches);