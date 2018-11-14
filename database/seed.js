const faker = require('faker');
const db = require('./index.js');
const Description  = require('./db.js');

const generateRandomDescription = (productId) => {
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
  return doc;
}


// const insertSampleDescriptions = function(recordCount) {
//   console.time('Timer');
//   const randomDescriptions = [];
//   for (let i = 0; i < recordCount; i++) {
//     randomDescriptions.push({insertOne: generateRandomDescription(i)});
//   }
//   Description.bulkWrite(randomDescriptions)
//   .then((res) => {console.log(res.insertedCount)})
//   .catch((err) => console.error(`There's an error --> `, err))
//   console.timeEnd('Timer');
// };
// insertSampleDescriptions(200000);
// // for (let i = 0; i < 3; i++) { 
// //   setTimeout(() => {insertSampleDescriptions(100000)}, 10000)
// // }

// let promises = []
// for (let i = 0; i < 10; i++) {
//   promises.push(new Promise(insertSampleDescriptions(300000)))
// }
// Promise.all(promises)
// .then(()=>{console.log('success')})

//--------------------------------------------------------------//

const insertSampleDescriptions = function(recordCount) {
  console.time('Timer');
  const randomDescriptions = [];
  for (let i = 0; i < recordCount; i++) {
    randomDescriptions.push({insertOne: generateRandomDescription(i)});
  }
  return Description.bulkWrite(randomDescriptions)
  // .then((res) => console.log(res.insertedCount))
  // .catch((err) => console.error(`There's an error --> `, err))
  // .finally(() => console.timeEnd('Timer'))
};

let promises = []
for (let i = 0; i < 10; i++) {
  promises.push(insertSampleDescriptions(300000));
}
Promise.all(promises)
.then((data)=>{
  console.log('success', data)
  console.timeEnd('Timer')
})



