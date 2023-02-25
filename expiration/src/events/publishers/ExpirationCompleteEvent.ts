import {
  ExpirationCreatedPublisherInterface,
  Publisher,
  Subjects,
} from "@ticketing-srv/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCreatedPublisherInterface> {
  subject: Subjects.EventExpirationCompleted =
    Subjects.EventExpirationCompleted;
}
