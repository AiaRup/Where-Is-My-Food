import DeliveryRepository from './delivery-repository.js';
import DeliveryRenderer from './delivery-renderer.js';
import EventsHandler from './events-handler-delivery.js';

let deliveryRepository = new DeliveryRepository();
let deliveryRenderer = new DeliveryRenderer();
let eventsHandler = new EventsHandler(deliveryRepository, deliveryRenderer);

eventsHandler.registerSelectEmployee();
eventsHandler.registerSelectOrder();
eventsHandler.registerUnSelectOrder();
eventsHandler.registerReadyToGo();
eventsHandler.registerChangeEmployee();


// Get all employees as soon as the page loads
deliveryRepository.getEmployeesList().then(() => {
  // render all employees on the page
  deliveryRenderer.renderDeliveryList(deliveryRepository.employeesList);
});