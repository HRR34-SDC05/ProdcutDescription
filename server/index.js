require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const = require('../database/.js');
const mongoDB = require('../database/describeMongo.js'); // Mongoose model == mongoDB
const postgreSQL = require ('../database/connectPg.js'); // Sequelize model == postgreSQL
const normalizePort = require('normalize-port');

var port = normalizePort(process.env.PORT || '8081');

let app = express();

postgreSQL.connect();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/../client/dist`, { maxAge: '365d' }));


app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

app.get('/product/:productId', function (req, res) {
  res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
});

// ------ CRUD ------ //

// ------ CREATE ------ //
app.post('/product/data/:productId', function (req, res) {
  // Mongo create
  mongoDB.create({
    productName: req.body.productId,
    productId: req.body.productId,
    features: req.body.features,
    techSpecs: req.body.techSpecs
  })
  .then(message => res.status(201).send(message))
  .catch(err => console.error(`There was an error with the POST request --> ${err}`));
  // PG create
})


// ------ READ ------ //
app.get('/productdescriptions', function (req, res) {
  console.log("GET REQUEST for product descriptions");
  // Mongo find
  // mongoDB.find({}, (err, data) => {
  //   if(err) {
  //     console.log("ERROR:", err);
  //   } else {
  //     res.status(200).send(data);
  //   }
  // });
  // PG Find
  postgreSQL.query(`SELECT * FROM descriptions LIMIT 10`)
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send('Could not complete GET request to Database', err))
});

app.get('/product/data/:productId', function (req, res) {
  console.log(` --> Received request on port ${port} <--`);
  var productId = req.params.productId;
  // console.time('API Inside')
  // console.time('API GET')
  console.log(`GET REQUEST for product Id ${productId}`);
  // Mongo Find Id
  // mongoDB.find({productId: productId}, (err, productData) => {
  //   if(err){
  //     console.log("ERROR:", err);
  //   }else{
  //     // console.log("GOT DATA");
  //     res.status(200).send(productData);
  //     // console.log(`productData inside CB --> `, productData);
  //     console.timeEnd('API Inside')
  //   }
  // })
  // .then(() => {return console.timeEnd('API GET');});
  // PG Find Id
  postgreSQL.query(`SELECT * FROM descriptions WHERE product_id = ${productId}`)
    .then((result) => {
      // result.rows[0].tech_specs = JSON.parse(result.rows[0].tech_specs);
      // console.log(`The TechSpecs are --> `, result.rows[0].tech_specs);
      res.status(200).send(result.rows)
      // console.timeEnd('API Inside')
    })
    // .then( () => console.timeEnd('API GET'))
    .catch((err) => res.status(500).send('Could not complete GET request to Database', err))

});


// ------ UPDATE ------ //
app.put('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  mongoDB.updateOne({ productId: productId }, req.body, (err, response) => {
    if (err) {
      console.error(`There was an error with the PUT request --> ${err}`)
    } else {
      res.status(200).send(response)
    }
  })
  // Add PG updateOne
})

app.patch('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  mongoDB.updateOne({ productId: productId }, req.body, (err, response) => {
    if (err) {
      console.error(`There was an error with the PUT request --> ${err}`)
    } else {
      res.status(200).send(response)
    }
  })
  // Add PG updateOne
})


// ------ DELETE ------ //
app.delete('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  mongoDB.deleteOne({productId: productId}, (err, res) => {
    if (err) {
      console.error(`There was an error with the DELETE --> ${err}`);
    } else {
      res.status(202).send()
    }
  })
  // Add PG DeleteOne
})