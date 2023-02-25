import {
  Listener,
  NotFoundError,
  OrderCancelledEventInterface,
  OrderStatus,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import { OUpdatedConsumerOptions, StreamName } from "./ConsumerOptions";

export class OrderCancelledListener extends Listener<OrderCancelledEventInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = StreamName.QueueGroupName;
  durableName: string = OUpdatedConsumerOptions.OUpdatedDurableName;
  deliverSubject: string = OUpdatedConsumerOptions.OUpdatedDeliverySubject;
  filterSubject: string = OUpdatedConsumerOptions.OUpdatedFilterSubject;
  streamName: string = StreamName.StreamName;

  async onMessage(data: OrderCancelledEventInterface["data"], msg: Msg) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.respond();
  }
}
