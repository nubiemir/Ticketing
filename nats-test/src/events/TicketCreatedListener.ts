import { Listener } from "@ticketing-srv/common";
import { Msg } from "nats";
import { TicketCreatedEventInterface } from "@ticketing-srv/common";
import { Subjects } from "@ticketing-srv/common";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  durableName = "tickets";
  deliverSubject = "ticket.created";
  filterSubject = "events.ticket.>";
  streamName = "mystream";
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payment-service";
  onMessage(data: TicketCreatedEventInterface["data"], msg: Msg) {
    console.log("event data: ", data);
    msg.respond();
  }
}
