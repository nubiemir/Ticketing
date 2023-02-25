import {
  Listener,
  NotFoundError,
  OrderCancelledEventInterface,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";
import { OUpdatedConsumerOptions, StreamName } from "./ConsumerOptions";

export class OrderCancelledListener extends Listener<OrderCancelledEventInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = StreamName.QueueGroupName;
  durableName: string = OUpdatedConsumerOptions.OUpdatedDurableName;
  deliverSubject: string = OUpdatedConsumerOptions.OUpdatedDeliverySubject;
  filterSubject: string = OUpdatedConsumerOptions.OUpdatedFilterSubject;
  streamName: string = StreamName.StreamName;

  async onMessage(data: OrderCancelledEventInterface["data"], msg: Msg) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this._client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.respond();
  }
}
