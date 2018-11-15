const {writeToTxt, insertToMongo} = require('./seed.js');

let fileStart = 0;
let fileEnd = 100;
insertToMongo(fileStart, fileEnd)
