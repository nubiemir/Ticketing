import { AuthAccess, validateRequest } from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { Ticket } from "../models/ticket";
import { nats } from "../NatsWrapper";
const router = express.Router();

router.post(
  "/api/tickets",
  AuthAccess,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(nats.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as TicketRouter };
