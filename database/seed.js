const faker = require('faker');
const fs = require('fs');
const csv = require('fast-csv');
// const csvtojson = require('csvtojson');
const {flatten, unflatten} = require('flat');
const csvWriter = require('csv-write-stream');
const path = require('path');

const db = require('./index.js');
const Description  = require('./db.js');

const generateRandomDescription = (productId) => {
  // console.time('Faker')
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
  // console.timeEnd('Faker')
  // console.log(`A document is --> `, doc);
  return (doc);
}

const createBatch = async function (recordCount, startingID = 0) {
// create a batch of random Descriptions (a number of descriptions, startingID)
  // I: a number of descriptions, number of batches
  // O: an array of descriptions
  // nb: prior to storing a description, allow it to resolve (i.e. use promises / async/await)
  let batchArray = [];
  for (let i = startingID; i < recordCount; i++){
    let description = await generateRandomDescription(i)
    batchArray.push(description)
    // console.log(`A resolved description is --> `, description)
    }
  console.log(`The final batchArray is --> `, flatten(batchArray));
  console.log(`There are ${batchArray.length} records in the batchArray`)
  return batchArray;
}


// fs.writeFile('sample.txt',jsonData, (err) => {if (err) {console.log(`there's an error`, err);}});
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
      // console.log(`The complete doc is --> `, doc)
      // console.log(`The typeof the doc is --> ${typeof doc}`);
      // console.log(`Doc is --> `, doc.toString('utf8'));
      // doc = doc.toString('utf8');
      let recordsArray = doc.split('\n')//
      recordsArray.pop(); // eliminates the newline on the very last reccord
      console.log(`PRE ---> The first element in the records array is --> ${recordsArray[0]} and it's type is ${typeof recordsArray[0]}`);
      recordsArray = recordsArray.map((rec) => {return JSON.parse(rec)});
      console.log(`POST ---> The first element in the records array is --> ${recordsArray[0]} and it's type is ${typeof recordsArray[0]}`);
      // JSON.parse(recordsArray.join(''));
      console.log(`The type of records array is ${typeof recordsArray} and the length is ${recordsArray.length}`);
      console.log(`The last element in the records array is --> ${recordsArray[recordsArray.length-1]}`)
      Description.create(recordsArray, (err) => {
        if (err) {console.log(`There's an error on insert --> `, err)}
      })
    })
  }
}

const writer = csvWriter({separator: ',', headers: ["productId", "productName", "features", "techSpecs"]})
const writeStreamToCSV = function (recordCount, fileCount) {
  for (let i = 0; i < fileCount; i++) {
    writer.pipe(fs.createWriteStream(path.join(__dirname,`sampleData_${i}`)))
    for (let j = 0; j < recordCount; j++) {
      let record = flatten(generateRandomDescription(j))
      console.log(`One record is --> `, record);
      writer.write(record)
    }
  }
}

const insertSampleDescriptions = function(recordCount, idStart = 0) {
  console.time('Insert')
  const randomDescriptions = [];
  for (let i = idStart; i < idStart + recordCount; i++) {
    let product = generateRandomDescription(i)
    randomDescriptions.push(flatten(product))
    // randomDescriptions.push({insertOne: {document: product}});
  }
  console.log(`A random product is --> `, randomDescriptions[8]);
  // console.log(`A stringified random product is -->`, JSON.stringify(randomDescriptions[8]));
  console.log(`The number of RandomDescriptions is --> `, randomDescriptions.length);
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
    csv.write(insertSampleDescriptions(recordsPerFile, productIdStart ))
    .pipe(writeStream);
    productIdStart += recordsPerFile;
  }
  console.timeEnd('CSV')
}


let loadCSVToMongo = async function(fileCount) {
  for (let i = 0; i < fileCount; i++) {
    const csvFilePath='sampleData_'.concat(i);
    let randomDescriptions = []
    let obj;
    await csvtojson()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
      console.log(jsonObj.length);
      // console.log(`The second element in the JSONObj is --> `, jsonObj[2])
      // console.log(`the jsonObject is --> `, jsonObj)
      return unflattenedObj = unflatten(jsonObj);
    })
    .then( (unflattenedObj) => {
      console.log(`The object's length -->`,unflattenedObj.length)
      console.log(`The 0th element in the unflattenedObj -->`, unflattenedObj);
      // console.log(`Object not stringified --> ${obj[0]}`)
      // console.log(`Object parsed --> ${JSON.stringify(obj[0])}`)
      for (let i = 0; i < obj.length; i++) {
        randomDescriptions.push({insertOne: {document: obj[i]}});
      }
    })
    .then(() => {
      Description.bulkWrite(randomDescriptions)
      console.log(`The number of records in randomDescriptions --> `, randomDescriptions.length)
      console.log(`The 89000th item in randomDescriptions -->`, randomDescriptions[89000])
    })
  }
}

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





// let randoDes = generateRandomDescription(1)
// let flattenedDes = flatten(randoDes);
// let flattendSafeDes = flatten(randoDes, {safe: true})
// let unflattenedDes = unflatten(flattenedDes);
// let unflattenedSafeDes = unflatten(flattendSafeDes);
// console.log(`Random Description is --> `, randoDes);
// console.log(`Flattened Description is --> `, flattenedDes);
// console.log(`Safe Flattened --> `, flattendSafeDes);
// console.log(`Unflattened Description is --> `, unflattenedDes);
// console.log(`Unflattened Safe Description --> `, unflattenedSafeDes);



let recordCount = 1000;
let fileCount = 1;
// writeToTxt(recordCount, fileCount)
readFromTxt(fileCount);
// writeStreamToCSV(recordCount, fileCount)
// writeToCSV(recordCount, fileCount)
// loadCSVToMongo(fileCount)
// createBatch(recordCount,0)

//write a stream to CSV
  // The stream generates a random piece of data

// load that CSV