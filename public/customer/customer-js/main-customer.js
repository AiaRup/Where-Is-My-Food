import EventHandlerCustomer from './events-handler-customer.js';
import CustomerRepository from './customer-repository.js';
import GoogleMap from '../../delivery/delivery-js/googleMap.js';

let googleMap = new GoogleMap();
let customerRepositories = new CustomerRepository();
let eventHandlersCustomer = new EventHandlerCustomer(customerRepositories, googleMap);

eventHandlersCustomer.findOrder();
eventHandlersCustomer.renderOrderDetails();
eventHandlersCustomer.refreshPage();


