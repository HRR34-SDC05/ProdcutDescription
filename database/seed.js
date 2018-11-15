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
    const file = fs.createWriteStream(path.join(__dirname,`/sampleData/sampleData_${i}.txt`))
    for (let j = startingID; j < recordCount + startingID; j++) {
      let record = JSON.stringify(generateRandomDescription(j)).concat('\n');
      file.write(record)
    }
    file.end()
    startingID += recordCount
  }
}

const writeAsync = async function (recordCount, fileCount) {
  console.time('WriteFilesToTxt')
  await writeToTxt(recordCount, fileCount);
  console.timeEnd('WriteFilesToTxt')
  process.exit();
}

const readFromTxt = function (fileId) {
  return new Promise((resolve , reject) => {
    const src = fs.createReadStream(path.join(__dirname,`sampleData/sampleData_${fileId}.txt`))
    let doc ='';
    src.on('data', (chunk) => {doc += chunk})
    src.on('end', () => {
      let recordsArray = doc.split('\n')//
      recordsArray.pop(); // eliminates the newline on the very last reccord
      recordsArray = recordsArray.map((rec) => {return JSON.parse(rec)});
      resolve(recordsArray)
    })
  })
}

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

module.exports.writeAsync = writeToTxt;
module.exports.insertToMongo = insertToMongo; 
