const {writeAsync, insertToMongo} = require('./seed.js');

let recordCount = 100000;
let fileCount = 100;

writeAsync(recordCount, fileCount)