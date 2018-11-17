const faker = require('faker');
const { Writable, Readable, Transform, Duplex } = require('stream');
// const copyFrom = require('pg-copy-streams').from;
const { Client } = require('pg');
// const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
// const { flatten, unflatten } = require('flat');
const chalk = require('chalk');

const config = require('../config.json')
const { generateRandomDescription } = require('./generateSampleRecords.js');


// parallel instances of node -
// 


// --------- Connect to PG --------- //
const table = 'descriptions';
const host = config.host;
const user = config.username;
const pw = config.password;
const db = config.database;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
});
client.connect();
// ----------------------------------//

// ------------------ Select Query ------------------ //
const selectQuery = `SELECT count(*) FROM descriptions;`


// ------------------ Insert X Records Into PG ------------------ //

const insertRecords = async (idStart, idEnd) => {
  for (let i = idStart; i < idEnd ; i++){
    // create record
    let record = generateRandomDescription(i)
    const insertQueryText = 'INSERT INTO descriptions (product_id, product_name, features, tech_specs) VALUES ($1, $2, $3, $4) RETURNING *';
    const insertQueryValues = [record.productId, record.productName, record.features, record.techSpecs];
    await client.query(insertQueryText, insertQueryValues)
    .then(res => console.log(res))
    .catch(err => console.error(chalk.red(`There was an error! --> `), err))
    // insert record
    // insert 1; \n
    // insert 2; \n
    // compile inserts
    // await client.query(/*compiled inserts */)
    }
  }
  
// -------------------------------------------------------------- //
  
insertRecords(0,1)

setTimeout(() => {client.end()}, 10000);
// client.end()


// --------- Create Read Stream of Random Data --------- //

// let recordCount = 1

// const descriptionReadStream = new Readable({
//   read() {
//     generateRandomDescription(descriptionReadStream.id++)
//     this.push(JSON.stringify());
//     client.query(INSERT )
//     if (descriptionReadStream.id > recordCount){
//       this.push(null);
//     }
//   },
//   end() {},
// })

// ----------------------------------------------------- //

// --------- Insert Record into Postgres --------- //



// ----------------------------------------------- //

// const executeQuery = (targetTable) => {
//   client.query(`SELECT COUNT(*) FROM ${targetTable}`)
//   .then((result) => console.log(`The result of the query is --> `, result))
// }
// executeQuery(table);

//  const executeQuery = (targetTable) => {
//     client.query('DROP TABLE IF EXISTS details')
//     client.query(createQuery);
//     const execute = (target, callback) => {
//         client.query(`Truncate ${target}`, (err) => {
//             if (err) {
//                 client.end();
//                 callback(err);
//             } else {
//                 console.log(`Truncated ${target}`);
//                 callback(null, target);
//             }
//         });
//     };
//     execute(targetTable, (err) => {
//         if(err) return console.log(`Error in Truncate: ${err}`);
//         let stream = ;
//         var fileStream = fs.createReadStream(dataFile);
//         fileStream.on('error', (error) => {
//             console.log(`Error in read stream: ${error}`);
//         });
//         stream.on('error', (error) => {
//             console.log(`Error in creating stream: ${error}`);
//         });
//         stream.on('end', () => {
//             console.log('Completed copy command.');
//             client.end();
//         });
//         fileStream.pipe(stream);
//     });
// };
//  executeQuery(table);



// -----------------------------------//

// console.time('Stream')


// const inOutStream = new Duplex({
//   write(chunk, encoding, callback) {
//     // console.log(`---> This is a chunk \n ${JSON.parse(chunk.toString())} \n`);
//     const arrayOfDescriptions = [];
//     arrayOfDescriptions.push(JSON.parse(chunk))
//     this.push(JSON.stringify(arrayOfDescriptions));
//     // callback();
//   },
//   read(size) {
//     this.push((generateRandomDescription(inOutStream.id++)))
//     // console.log(`-------> The ID is ${inOutStream.id} <-------`);
//     if (inOutStream.id > limit) {
//       // console.log(`\n\n -------> I've reached my limit! --> The Id is ${inOutStream.id} and limit is ${limit} <-------\n`);
//       this.push(null)
//     }
//   }
// })

// const stringToObject = new Transform({
//   readableObjectMode: true,
//   writableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     // console.log(`---> This is a chunk \n`, JSON.parse(chunk));
//     // const arrayOfDescriptions = [];
//     // arrayOfDescriptions.push(JSON.parse(chunk))
//     // this.push(JSON.stringify(arrayOfDescriptions));
//     let record = unflatten(chunk);
//     // copy record to PG
//     this.push(record)
//     callback();
//   }
// })

// Connect
// Define TABLE
// descriptionReadStream.id = 1;
// descriptionReadStream
  // .pipe(process.stdout);
  // .pipe(stringToObject)
  // .pipe(client.query(copyFrom(`COPY ${table} FROM STDIN csv quote e'\x01' delimiter e'\x02';`)))
// Disconnect
// client.end();

// inOutStream.id = 1;
// inOutStream
  // .pipe(inOutStream)
  // .pipe(process.stdout)
  // .on('finish', () => console.log('Done!'))

// console.timeEnd('Stream')