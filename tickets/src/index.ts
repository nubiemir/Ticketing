import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/OrderCancelledListener";
import { OrderCreatedListener } from "./events/listeners/OrderCreactedListener";
import { nats } from "./NatsWrapper";
(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT key must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must defined");
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
    new OrderCancelledListener(nats.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(3002, () => {
    console.log("port: => 3002");
  });
})();
