let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;
let path = require('path');
let Restaurant = require('./models/restaurantModel');

mongoose.Promise = global.Promise;

// Connect to DB and check the connection
let connection = process.env.CONNECTION_STRING || 'mongodb://localhost/spacebookDB';
mongoose.connect(connection, { useMongoClient: true })
  .then(() => {console.log('Successfully connected to mongoDB');})
  .catch((error) => console.error(error));


let app = express();

// Middlewares
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// PORT
const SERVER_PORT = process.env.PORT || 8000;
app.listen(SERVER_PORT, () => console.log(`Server up and running on port ${SERVER_PORT}...`));


//restaurant
app.get('/', (req, res) => { // homepage restaurant
  res.sendFile(path.join(__dirname + '/public/html/restaurant.html'));
});

app.route('/orders')
  .get((req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/orders.html'));
  })
  .post((res, req) => {
  });

app.update('/orders/:id', (req, res) => {
});

// delivery
app.get('/delivery', function(req, res){
  res.sendFile(path.join(__dirname + '/public/html/delivery.html'));
});

app.get('/deliveryOnTheWay', function(req, res){
  res.sendFile(path.join(__dirname + '/public/html/deliveryOnTheWay.html'));
});


// customer
app.get('/customer', function(req, res){
  res.sendFile(path.join(__dirname + '/public/html/customer.html'));
});

app.get('/customer/:id', function(req, res){
  res.sendFile(path.join(__dirname + '/public/html/customerTime.html'));
});

