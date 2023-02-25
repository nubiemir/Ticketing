import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@ticketing-srv/common";
import { NewOrderPost } from "./routes/new";
import { ShowOrder } from "./routes/show";
import { ShowAllOrders } from "./routes";
import { deleteOrder } from "./routes/cancel";
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
app.use(ShowOrder);
app.use(ShowAllOrders);
app.use(deleteOrder);
app.use(NewOrderPost);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
