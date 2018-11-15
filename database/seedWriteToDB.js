const {writeToTxt, insertToMongo} = require('./seed.js');

let fileStart = 0;
let fileEnd = 1000;
insertToMongo(fileStart, fileEnd)
