import {
  Listener,
  Subjects,
  PaymentCreatedInterface,
  NotFoundError,
  OrderStatus,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import {
  StreamName as ComOpts,
  PCreatedConsumerOptions,
} from "./ConsumerOptions";

export class PaymentCreatedListener extends Listener<PaymentCreatedInterface> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  durableName = PCreatedConsumerOptions.PCreatedDurableName;
  deliverSubject = PCreatedConsumerOptions.PCreatedDeliverSubject;
  filterSubject = PCreatedConsumerOptions.PCreatedFilterSubject;
  streamName = ComOpts.StreamName;
  queueGroupName = ComOpts.QueueGroupName;
  async onMessage(data: PaymentCreatedInterface["data"], msg: Msg) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new NotFoundError();
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    msg.respond();
  }
}
