export enum OCreatedConsumerOptions {
  OCreatedDeliverSubject = "order.created",
  OCreatedFilterSubject = "events.order.created",
  OCreatedDurableName = "orderCreated",
}

export enum OUpdatedConsumerOptions {
  OUpdatedDeliverySubject = "order.cancelled",
  OUpdatedFilterSubject = "events.order.cancelled",
  OUpdatedDurableName = "orderCancelled",
}

export enum StreamName {
  StreamName = "mystream",
  QueueGroupName = "payments-service",
}
