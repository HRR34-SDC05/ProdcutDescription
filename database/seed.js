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
  console.time('CreateFiles')
  startingID = 0
  for (let i = 0; i < fileCount; i++) { 
    // console.log(`Starting file number --> ${i}`);
    // console.log(`Document's startingID is --> ${startingID}`);
    const file = fs.createWriteStream(path.join(__dirname,`/sampleData/sampleData_${i}.txt`))
    for (let j = startingID; j < recordCount + startingID; j++) {
      let record = JSON.stringify(generateRandomDescription(j)).concat('\n');
      file.write(record)
    }
    file.end()
    startingID += recordCount
    // console.log(`Ending file number --> ${i}`);
  }
  console.timeEnd('CreateFiles')
}

const readFromTxt = function (fileId) {
  console.time('ReadFiles')
  // for (let i = fileStart; i < fileEnd; i++) {
    console.log(`Currently reading the file --> ${fileId}`);
    const src = fs.createReadStream(path.join(__dirname,`sampleData/sampleData_${fileId}.txt`))
    let doc ='';
    src.on('data', (chunk) => {doc += chunk})
    src.on('end', () => {
      let recordsArray = doc.split('\n')//
      console.log(`The length of the recordsArray is ${recordsArray.length}`);
      recordsArray.pop(); // eliminates the newline on the very last reccord
      recordsArray = recordsArray.map((rec) => {return JSON.parse(rec)});
      // return recordsArray
      Description.create(recordsArray, (err) => {
        if (err) {console.log(`There's an error on insert --> `, err)}
      })
    })
  console.timeEnd('ReadFiles')
}

const insertToMongo = async function (fileStart, fileEnd) {
  console.time('WriteFilesToMongo')
  for (let i = fileStart; i < fileEnd; i++) {
    let recordsToCreate = await readFromTxt(i)
    Description.create(recordsToCreate, (err) => {
      if (err) {console.log(`There's an error on insert --> `, err)}
    })
  }
  console.timeEnd('WriteFilesToMongo')
}

let recordCount = 1000;
let fileCount = 1000;
// writeToTxt(recordCount, fileCount)
// readFromTxt(1);
insertToMongo(0, 1000)
// readFromTxt(10, 19);
// readFromTxt(20, 29);
// readFromTxt(30, 39);
// readFromTxt(40, 49);
// readFromTxt(50, 59);
// readFromTxt(60, 69);
// readFromTxt(70, 79);
// readFromTxt(80, 89);
// readFromTxt(90, 99);