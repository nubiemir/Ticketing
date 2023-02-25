import {
  AuthAccess,
  NotFoundError,
  OrderStatus,
  UnauthorizedAccess,
} from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publisher/orderCancelled";
import { Order } from "../models/order";
import { nats } from "../NatsWrapper";

const router = express.Router();

router.patch(
  "/api/orders/:id",
  AuthAccess,

  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedAccess();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(nats.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.send({ order });
  }
);

export { router as deleteOrder };
