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
const SERVER_PORT = process.env.PORT || 80;
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

    Restaurant.findOneAndUpdate({}, { $push:{ orders: req.body } }, { new:true }, (err, updatedRes) => {
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
  console.log('property', req.body.property);
  console.log('value', req.body.value);


  let $update = { $set: {} };
  $update.$set[`orders.$.${req.body.property}`] = req.body.value;

  Restaurant.findOneAndUpdate({ 'orders.orderId': id },  $update, { new: true }, (err, updatedRestaurant) => {
    if (err) throw err;
    res.send(updatedRestaurant.orders);
  });
});

// 6) update map info to specific order
app.put('/orders/:id/map', (req, res) => {
  let id = req.params.id;
  console.log('body data adrees string', req.body);


  Restaurant.findOne({ 'orders.orderId': id }, (err, updatedRestaurant) => {
    if (err) throw err;

    for(let i=0; i< updatedRestaurant.orders.length; i++) {
      if (updatedRestaurant.orders[i].orderId == id) {
        updatedRestaurant.orders[i].mapRoute.push(req.body.address);
      }
    }
    updatedRestaurant.save((error, restaUpdate) => {
      if (error) throw error;
      res.send(restaUpdate.orders);
    });
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

app.get('/customerTime', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/html/customerTime.html'));
});

app.get('/customer/:id', (req, res) => {
  let id = req.params.id;
  console.log('id in server', id);

  Restaurant.findOne({ 'orders.orderId': id }, (err, restaResult) => {
    if (err) throw err;
    // order doesn't exist
    if (!restaResult) {
      res.send('Order Not Found');
    } else {
    // order exist
      for(let i=0; i< restaResult.orders.length; i++) {
        if (restaResult.orders[i].orderId == id) {
          res.send(restaResult.orders[i]);
        }
      }
    }
  });
});
app.route('/ord/menu') // need to add that it will get restuarnt name as parameter
  .get((req,res) => {
    Restaurant.findOne({name: "Bar & Mazi" }, function(err, restaurant) {
      if(err){
        res.send(err);
      }
      else {
        res.send(restaurant.menu);
      }
       
  });
})
// orders (add by Kobi for orders page)
app.route('/ord')
  .put((req, res) => {
    // console.log(req.body)
    Restaurant.findOne({ orders: { $elemMatch:{ orderId: req.body.orderId } } }, function(err, restaurant) {
      // console.log(restaurant);

      for(var i=0; i< restaurant.orders.length && restaurant.orders[i].orderId != req.body.orderId; i++);
      console.log(i);
      restaurant.orders[i].name =req.body.name;
      restaurant.orders[i].phoneNumber =req.body.phoneNumber;
      restaurant.orders[i].status =req.body.status;
      restaurant.orders[i].location =req.body.location;
      restaurant.orders[i].dishes =req.body.dishes;
      restaurant.orders[i].totalPrice =req.body.totalPrice.slice(0, 2);
      restaurant.save(function(err) {
        if (err) console.log(err);
        else res.send('order successfully updated!');
      });
    });
  });
  
app.route('/ord2')
  .put((req, res) => {
    // console.log(req.body)
    Restaurant.findOne({ orders: { $elemMatch:{ orderId: req.body.orderId } } }, function(err, restaurant) {
      // console.log(restaurant);

      for(var i=0; i< restaurant.orders.length && restaurant.orders[i].orderId != req.body.orderId; i++);
      console.log(i);
      restaurant.orders[i].name =req.body.name;
      restaurant.orders[i].status =req.body.status;
      restaurant.save(function(err) {
        if (err) console.log(err);
        else res.send('order successfully updated!');
      });
    });
  });
// Restaurant.findOneAndUpdate({}, {$push:{orders:req.body}}, {new:true}, (err, updatedRes) => {
//   console.log(updatedRes)
//   res.send(updatedRes);

