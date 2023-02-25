import {
  Publisher,
  Subjects,
  TicketUpdatedPublisherInterface,
} from "@ticketing-srv/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedPublisherInterface> {
  subject: Subjects.EventTicketUpdated = Subjects.EventTicketUpdated;
}
