let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;
let path = require('path');
let Restaurant = require('./models/restaurantModel');

mongoose.Promise = global.Promise;

// Connect to DB and check the connection
let connection = process.env.CONNECTION_STRING || 'mongodb://localhost/restaurantDB';
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


// restaurant
app.get('/', (req, res) => { // homepage restaurant
  res.sendFile(path.join(__dirname + '/public/html/restaurant.html'));
});

app.route('/orders')
  .get((req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/orders.html'));
  })
  .post((res, req) => {
  });

// 3) update order property
app.put('/orders/:id', (req, res) => {
  let id = req.params.id;

  // Check if the ID is a valid mongoose id
  if (!ObjectID.isValid(id)) {
    return res.status(400).send('Id not in the correct format');
  }

  let $update = { $set: {} };
  $update.$set[`orders.$.${req.body.property}`] = req.body.value;
  Restaurant.update({ 'orders.orderId': id }, $update, { new: true }, (err, updatedOrder) => {
    if (err) throw err;
    res.send(updatedOrder);
  });
});

// delivery
// 1) get the delivery homepage
app.get('/delivery', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/delivery.html'));
});

// 2) get the deliveryOnTheWay Page
app.get('/deliveryOnTheWay', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/deliveryOnTheWay.html'));
});

// 3) get the list of employees
app.get('/delivery/employees', (req, res) => {
  Restaurant.find({}).populate('employees').exec((err, restaurantResult) => {
    if (err) throw err;
    res.send(restaurantResult[0].employees);
  });
});

// 4) get all the orders that are ready for delivery
app.get('/delivery/ordersReady', (req, res) => {
  Restaurant.find({}).populate('orders').exec((err, restaurantResult) => {
    if (err) throw err;
    console.log(restaurantResult[0].orders);
    res.send(restaurantResult[0].orders);
  });
});

// customer
// 1) get the customer homepage
app.get('/customer', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/customer.html'));
});

app.get('/customer/:id', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/customerTime.html'));
});

