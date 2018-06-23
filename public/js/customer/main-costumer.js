import EventHandlerCustomer from './events-handler-customer.js';
import RenderCustomer from './customer-render.js';
import CustomerRepository from './customer-repository.js';
import GoogleMap from '../delivery/googleMap.js';



let rendersCustomer = new RenderCustomer();
let googleMap = new GoogleMap();
let customerRepositories = new CustomerRepository();
let eventHandlersCustomer = new EventHandlerCustomer(customerRepositories, rendersCustomer, googleMap);


eventHandlersCustomer.findOrder();
eventHandlersCustomer.renderOrderDetails();
eventHandlersCustomer.refreshPage();
eventHandlersCustomer.showOrderDetails();


