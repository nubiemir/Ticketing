import mongoose from "mongoose";
import { app } from "./app";
import { ExpirationCompleteListener } from "./events/listeners/ExpirationCompleteListener";
import { TicketCreatedListener } from "./events/listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./events/listeners/TicketUpdatedListener";
import { PaymentCreatedListener } from "./events/listeners/PaymentCreatedListener";
import { nats } from "./NatsWrapper";
(async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT key must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must defined");
  try {
    await nats.connect(process.env.NATS_URL, process.env.NATS_CLUSTER_ID);

    new TicketCreatedListener(nats.client).listen();
    new TicketUpdatedListener(nats.client).listen();
    new ExpirationCompleteListener(nats.client).listen();
    new PaymentCreatedListener(nats.client).listen();
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(3003, () => {
    console.log("port: => 3002");
  });
})();
