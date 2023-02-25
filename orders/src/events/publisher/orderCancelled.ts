import {
  OrderCancelledPublisherInterface,
  Publisher,
  Subjects,
} from "@ticketing-srv/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledPublisherInterface> {
  subject: Subjects.EventOrderCancelled = Subjects.EventOrderCancelled;
}
