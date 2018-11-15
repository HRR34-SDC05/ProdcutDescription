const faker = require('faker');
const fs = require('fs');
const csv = require('fast-csv');
const path = require('path')

const db = require('./index.js');
const Description  = require('./db.js');

const generateRandomDescription = (productId) => {
  // console.time('Faker')
  productId = productId;
  const productName = faker.commerce.productName;
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
  // console.timeEnd('Faker')
  return doc;
}

const insertSampleDescriptions = function(recordCount, idStart = 0) {
  console.time('Insert')
  const randomDescriptions = [];
  for (let i = idStart; i < idStart + recordCount; i++) {
    let product = generateRandomDescription(i)
    randomDescriptions.push((product))
    // randomDescriptions.push({insertOne: {document: product}});
  }
  // console.log(`The Descriptions are --> `, JSON.stringify(randomDescriptions))
  return randomDescriptions
  // console.log(`record count: ${randomDescriptions.length}, `);
  // Description.bulkWrite(randomDescriptions)
  // console.timeEnd('Insert');
};


const writeToCSV = function(recordsPerFile, fileCount = 0) {
  console.time('CSV')
  let productIdStart = 0
  for (let i = 0; i < fileCount; i++) {
    let file = 'sampleData_'.concat(i)
    console.log(`The file is --> `, file)
    const writeStream = fs.createWriteStream(file)
    // csv.write - Expects an array 
    csv.write(insertSampleDescriptions(recordsPerFile, productIdStart ), {headers:true})
    .pipe(writeStream);
    productIdStart += recordsPerFile;
  }
  console.timeEnd('CSV')
}


writeToCSV(100000,2)



let batchLoad = async (batchCount, batchSize) => {
  console.time('Timer');
  try{ 
    let idStart = 0
    for (i = 0; i < batchCount; i++) {
      await insertSampleDescriptions(batchSize, idStart)
      console.log(`Inserted here -->`, batchCount, idStart)
      idStart += batchSize;
    }
  } catch (err) {
    console.error(`The error is`, err)
  }
  await console.timeEnd('Timer')
  console.log('success')
}


// batchLoad(batchCount, batchSize);
let slowLoad = async (batches) => {
  console.time('slow')
  for (let i = 0; i < batches; i++) {
    await batchLoad(10, 10000)
  }
  console.timeEnd('slow')
}
// slowLoad(10)
// if 10 works, can I bump slow load up to 100?


