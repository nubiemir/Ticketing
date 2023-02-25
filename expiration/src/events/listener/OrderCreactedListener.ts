import {
  Listener,
  NotFoundError,
  OrderCreatedEventInterface,
  OrderStatus,
  Subjects,
} from "@ticketing-srv/common";
import { Msg } from "nats";
import { expirationQueue } from "../../queues/ExpirationQueues";
import { OCreatedConsumerOptions, StreamName } from "./ConsumerOptions";

export class OrderCreatedListener extends Listener<OrderCreatedEventInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = StreamName.QueueGroupName;
  durableName: string = OCreatedConsumerOptions.OCreatedDurableName;
  deliverSubject: string = OCreatedConsumerOptions.OCreatedDeliverSubject;
  filterSubject: string = OCreatedConsumerOptions.OCreatedFilterSubject;
  streamName: string = StreamName.StreamName;

  async onMessage(data: OrderCreatedEventInterface["data"], msg: Msg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("delay", delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.respond();
  }
}
