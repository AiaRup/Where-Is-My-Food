import EventHandlerCustomer from './events-handler-customer.js';
import RenderCustomer from './customer-render.js';
import CustomerRepository from './customer-repository.js';



let rendersCustomer = new RenderCustomer;
let customerRepositories = new CustomerRepository();
let eventHandlersCustomer = new EventHandlerCustomer(customerRepositories, rendersCustomer);


eventHandlersCustomer.submitCode();
eventHandlersCustomer.getOrderInfo();




