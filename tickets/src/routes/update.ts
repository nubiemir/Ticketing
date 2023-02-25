import {
  AuthAccess,
  BadRequestError,
  NotFoundError,
  UnauthorizedAccess,
  validateRequest,
} from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";
import { Ticket } from "../models/ticket";
import { nats } from "../NatsWrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  AuthAccess,
  [
    body("title")
      .isString()
      .not()
      .isEmpty()
      .withMessage("Ticket title must be provided"),
    body("price").isFloat({ gt: 0 }).withMessage("Ticket price must be > 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId)
      throw new BadRequestError("cannot edit a reserved ticket");
    if (ticket.userId !== req.currentUser?.id) throw new UnauthorizedAccess();
    ticket.set({ title, price });
    await ticket.save();
    new TicketUpdatedPublisher(nats.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send({ ticket });
  }
);

export { router as UpdateTicket };
