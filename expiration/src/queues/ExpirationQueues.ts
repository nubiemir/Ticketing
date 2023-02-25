import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/ExpirationCompleteEvent";
import { nats } from "../NatsWrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("orderExpiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(nats.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
