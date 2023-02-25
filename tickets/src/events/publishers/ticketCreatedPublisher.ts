import {
  Publisher,
  Subjects,
  TicketCreatedPublisherInterface,
} from "@ticketing-srv/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedPublisherInterface> {
  subject: Subjects.EventTicketCreated = Subjects.EventTicketCreated;
}
