import {
  OrderCreatedPublisherInterface,
  Publisher,
  Subjects,
} from "@ticketing-srv/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedPublisherInterface> {
  subject: Subjects.EventOrderCreated = Subjects.EventOrderCreated;
}
