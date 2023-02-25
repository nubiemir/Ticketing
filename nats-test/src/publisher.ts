import { connect } from "nats";
import { TicketCreatedPublisher } from "./events/TicketCreatedPublisher";
const server = "http://localhost:4222";

const myStream = "mystream";
const sub = "events.>";
const data = {
  id: "123",
  title: "concert",
  price: 20,
};

connect({
  servers: server,
}).then(async (nc) => {
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({
    name: myStream,
    subjects: [sub],
    max_consumers: -1,
    description: "practicing for jetStream",
  });

  const publisher = new TicketCreatedPublisher(nc);
  await publisher.publish(data);
});
