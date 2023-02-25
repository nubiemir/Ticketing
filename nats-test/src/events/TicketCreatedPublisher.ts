import { Publisher } from "@ticketing-srv/common";
import { Subjects } from "@ticketing-srv/common";
import { TicketCreatedPublisherInterface } from "@ticketing-srv/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedPublisherInterface> {
  subject: Subjects.EventTicketCreated = Subjects.EventTicketCreated;
}
