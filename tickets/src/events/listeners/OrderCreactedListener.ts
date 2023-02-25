import {
  Listener,
  NotFoundError,
  OrderCreatedEventInterface,
  OrderStatus,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";
import { OCreatedConsumerOptions, StreamName } from "./ConsumerOptions";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = StreamName.QueueGroupName;
  durableName: string = OCreatedConsumerOptions.OCreatedDurableName;
  deliverSubject: string = OCreatedConsumerOptions.OCreatedDeliverSubject;
  filterSubject: string = OCreatedConsumerOptions.OCreatedFilterSubject;
  streamName: string = StreamName.StreamName;

  async onMessage(data: OrderCreatedEventInterface["data"], msg: Msg) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: data.id });

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
