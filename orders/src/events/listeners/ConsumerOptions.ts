export enum TCreatedConsumerOptions {
  TCreatedDeliverSubject = "ticket.created",
  TCreatedFilterSubject = "events.ticket.created",
  TCreatedDurableName = "ticketCreated",
}

export enum TUpdatedConsumerOptions {
  TUpdatedDeliverySubject = "ticket.updated",
  TUpdatedFilterSubject = "events.ticket.updated",
  TUpdatedDurableName = "ticketUpdated",
}

export enum ECompletedConsumerOptions {
  ECompletedDeliverySubject = "expiration.completed",
  ECompletedFilterSubject = "events.expiration.completed",
  ECompletedDurableName = "expirationComplted",
}

export enum PCreatedConsumerOptions {
  PCreatedDeliverSubject = "payment.created",
  PCreatedFilterSubject = "events.payment.created",
  PCreatedDurableName = "paymentCreated",
}

export enum StreamName {
  StreamName = "mystream",
  QueueGroupName = "tickets-service",
}
