// const nr = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
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
  postgreSQL.create({
    product_name: req.body.productName,
    product_id: req.body.productId,
    features: req.body.features,
    tech_specs: req.body.techSpecs
  })
  .then(message => res.status(201).send(message))
  .catch(err => console.error(`There was an error with the POST request --> ${err}`));
})


// ------ READ ------ //
app.get('/productdescriptions', function (req, res) {
  postgreSQL.query(`SELECT * FROM descriptions LIMIT 10`)
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send('Could not complete GET request to Database', err))
});

app.get('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  postgreSQL.query(`SELECT * FROM descriptions WHERE product_id = ${productId}`)
    .then((result) => res.status(200).send(result.rows))
    .catch((err) => res.status(500).send('Could not complete GET request to Database', err))
});

// ------ UPDATE ------ //
app.put('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  postgreSQL.update(
    { 
      product_name: req.body.productName,
      features: req.body.features,
      tech_specs: req.body.techSpecs
    },
    { where: {product_id: productId}}
    )
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(500).send(`There was an error with the PUT request --> ${err}`))
})


// ------ DELETE ------ //
app.delete('/product/data/:productId', function (req, res) {
  var productId = req.params.productId;
  postgreSQL.destroy({ where: { product_id: productId } })
})