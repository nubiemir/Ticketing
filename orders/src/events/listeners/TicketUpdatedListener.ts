import {
  Listener,
  Subjects,
  TicketUpdatedEventInterface,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";
import {
  StreamName as ComOpts,
  TUpdatedConsumerOptions,
} from "./ConsumerOptions";

export class TicketUpdatedListener extends Listener<TicketUpdatedEventInterface> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  durableName = TUpdatedConsumerOptions.TUpdatedDurableName;
  deliverSubject = TUpdatedConsumerOptions.TUpdatedDeliverySubject;
  filterSubject = TUpdatedConsumerOptions.TUpdatedFilterSubject;
  streamName = ComOpts.StreamName;
  queueGroupName = ComOpts.QueueGroupName;
  async onMessage(data: TicketUpdatedEventInterface["data"], msg: Msg) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.respond();
  }
}
