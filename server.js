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
// 1) get the restaurant homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/restaurant.html'));
});

// 2) get the orders homepage and post new order
app.route('/orders')
  .get((req, res) => {
    res.sendFile(path.join(__dirname + '/public/html/orders.html'));
  })
  .put((req, res) => {
    console.log(req.body);
    Restaurant.findOneAndUpdate({}, { $push:{ orders:req.body } }, { new:true }, (err, updatedRes) => {
      res.send(updatedRes);
    }
    );
  });

// 3) get the restaurant's name and menu
app.get('/restaurant/restauranNameMenu', (req, res) => {
  Restaurant.find({}, (err, restaurantResult) => {
    if (err) throw err;
    res.send(restaurantResult);
  });
});

// 4) get the restaurant's number of orders and update the number
app.route('/restaurant/restauranNumOrders')
  .get((req, res) => {
    Restaurant.find({}, (err, restaurantResult) => {
      if (err) throw err;
      res.send(restaurantResult);
    });
  })
  .put((req, res) => {
    console.log(req.body.ordersNumber);
    Restaurant.findOneAndUpdate({}, { numOrders : req.body.ordersNumber }, { new:true }, (err, updatedRes) => {
      res.send(updatedRes);
    });
  });

// 5) update order property
app.put('/orders/:id', (req, res) => {
  let id = req.params.id;
  console.log(id);

  let $update = { $set: {} };
  $update.$set[`orders.$.${req.body.property}`] = req.body.value;

  Restaurant.findOneAndUpdate({ 'orders.orderId': id },  $update, { new: true }, (err, updatedRestaurant) => {
    if (err) throw err;
    res.send(updatedRestaurant.orders);
  });
});

// delivery
// 1) get the delivery homepage
app.get('/delivery', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/delivery.html'));
});

// 3) get the list of employees
app.get('/delivery/employees', (req, res) => {
  Restaurant.find({}).populate('employees').exec((err, restaurantResult) => {
    if (err) throw err;
    res.send(restaurantResult[0].employees);
  });
});

// 4) get all the orders
app.get('/delivery/ordersReady', (req, res) => {
  Restaurant.find({}).populate('orders').exec((err, restaurantResult) => {
    if (err) throw err;
    res.send(restaurantResult[0].orders);
  });
});

// 5) get restaurant location
app.get('/delivery/restauranLocation', (req, res) => {
  Restaurant.find({}).exec((err, restaurantResult) => {
    if (err) throw err;
    res.send(restaurantResult[0].address);
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