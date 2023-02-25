import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@ticketing-srv/common";
import { TicketRouter } from "./routes/new";
import { ShowTicket } from "./routes/show";
import { ShowAllTickets } from "./routes";
import { UpdateTicket } from "./routes/update";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);
app.use(ShowTicket);
app.use(ShowAllTickets);
app.use(UpdateTicket);
app.use(TicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
