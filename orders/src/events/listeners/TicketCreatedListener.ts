import {
  Listener,
  Subjects,
  TicketCreatedEventInterface,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";
import {
  StreamName as ComOpts,
  TCreatedConsumerOptions,
} from "./ConsumerOptions";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  durableName = TCreatedConsumerOptions.TCreatedDurableName;
  deliverSubject = TCreatedConsumerOptions.TCreatedDeliverSubject;
  filterSubject = TCreatedConsumerOptions.TCreatedFilterSubject;
  streamName = ComOpts.StreamName;
  queueGroupName = ComOpts.QueueGroupName;
  async onMessage(data: TicketCreatedEventInterface["data"], msg: Msg) {
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });
    await ticket.save();
    msg.respond();
  }
}
