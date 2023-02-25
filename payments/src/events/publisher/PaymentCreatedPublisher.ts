import {
  PaymentCreatedPublisheInterface,
  Publisher,
  Subjects,
} from "@ticketing-srv/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedPublisheInterface> {
  subject: Subjects.EventPaymentCreated = Subjects.EventPaymentCreated;
}
