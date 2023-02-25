import {
  ExpirationCreatedEventInterface,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/orderCancelled";
import {
  ECompletedConsumerOptions,
  StreamName as ComOpts,
} from "./ConsumerOptions";

export class ExpirationCompleteListener extends Listener<ExpirationCreatedEventInterface> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  durableName = ECompletedConsumerOptions.ECompletedDurableName;
  deliverSubject = ECompletedConsumerOptions.ECompletedDeliverySubject;
  filterSubject = ECompletedConsumerOptions.ECompletedFilterSubject;
  streamName = ComOpts.StreamName;
  queueGroupName = ComOpts.QueueGroupName;
  async onMessage(data: ExpirationCreatedEventInterface["data"], msg: Msg) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) throw new NotFoundError();
    if (order.status === OrderStatus.Complete) {
      return msg.respond();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this._client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    msg.respond();
  }
}
