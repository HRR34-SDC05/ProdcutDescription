const faker = require('faker');
const fs = require('fs');
const path = require('path');

const db = require('./index.js');
const Description  = require('./db.js');

const generateRandomDescription = (productId) => {
  productId = productId;
  const productName = faker.commerce.productName();
  const features = []
  const featureCount = faker.random.number({min: 5, max: 10})
  for (let i = 0; i < featureCount; i++) {
    features.push(faker.commerce.productAdjective())
  }
  const techSpecs = []
  const techSpecCount = faker.random.number({min: 3, max: 5})
  for (let i = 0; i < techSpecCount; i++) { 
    let type = faker.lorem.word();
    let description= faker.commerce.productAdjective();
    let measurement= Math.random() > .5 ? true : false;
    let techSpec = {type, description, measurement};
    techSpecs.push(techSpec)
  }
  const doc = {productId, productName, features, techSpecs}
  return (doc);
}

const writeToTxt = function (recordCount, fileCount) {
  startingID = 0
  for (let i = 0; i < fileCount; i++) { 
    console.log(`Starting file number --> ${i}`);
    const file = fs.createWriteStream(path.join(__dirname,`sampleData_${i}.txt`))
    for (let j = startingID; j < recordCount + startingID; j++) {
      let record = JSON.stringify(generateRandomDescription(j)).concat('\n');
      file.write(record)
    }
    file.end()
    startingID += recordCount
    console.log(`Ending file number --> ${i}`);
  }
}

const readFromTxt = function (fileCount) {
  for (let i = 0; i < fileCount; i++) {
    const src = fs.createReadStream(path.join(__dirname,`sampleData_0.txt`))
    let doc ='';
    src.on('data', (chunk) => {doc += chunk})
    src.on('end', () => {
      let recordsArray = doc.split('\n')//
      recordsArray.pop(); // eliminates the newline on the very last reccord
      recordsArray = recordsArray.map((rec) => {return JSON.parse(rec)});
      Description.create(recordsArray, (err) => {
        if (err) {console.log(`There's an error on insert --> `, err)}
      })
    })
  }
}

let recordCount = 1000;
let fileCount = 1;
// writeToTxt(recordCount, fileCount)
readFromTxt(fileCount);
