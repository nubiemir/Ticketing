import {
  AuthAccess,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/publisher/orderCreated";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { nats } from "../NatsWrapper";
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  AuthAccess,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket to be ordered
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // check the ticket status

    const isReserved = await ticket.checkExistingOrder();

    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // calculate an expiration time for the order

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order & save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    // publish an event order was created

    new OrderCreatedPublisher(nats.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send({ order });
  }
);

export { router as NewOrderPost };
