import { OrderCreatedListener } from "./events/listener/OrderCreactedListener";
import { nats } from "./NatsWrapper";
(async () => {
  if (!process.env.NATS_URL) throw new Error("NATS_URL must defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must defined");
  try {
    await nats.connect(process.env.NATS_URL, process.env.NATS_CLUSTER_ID);

    process.on("SIGTERM", () =>
      nats.client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
    new OrderCreatedListener(nats.client).listen();
  } catch (err) {
    console.log(err);
  }
})();
