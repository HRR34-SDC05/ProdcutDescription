const {writeAsync, insertToMongo} = require('./seed.js');

let recordCount = 1000;
let fileCount = 1000;

writeAsync(recordCount, fileCount)