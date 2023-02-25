import {
  Listener,
  NotFoundError,
  OrderCreatedEventInterface,
  OrderStatus,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import { OCreatedConsumerOptions, StreamName } from "./ConsumerOptions";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = StreamName.QueueGroupName;
  durableName: string = OCreatedConsumerOptions.OCreatedDurableName;
  deliverSubject: string = OCreatedConsumerOptions.OCreatedDeliverSubject;
  filterSubject: string = OCreatedConsumerOptions.OCreatedFilterSubject;
  streamName: string = StreamName.StreamName;

  async onMessage(data: OrderCreatedEventInterface["data"], msg: Msg) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.respond();
  }
}
