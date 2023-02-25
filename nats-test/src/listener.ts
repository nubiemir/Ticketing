import { connect } from "nats";
import { TicketCreatedListener } from "./events/TicketCreatedListener";
const server = "http://localhost:4222";

const nc = connect({
  servers: server,
}).then((res) => {
  new TicketCreatedListener(res).listen();
});
