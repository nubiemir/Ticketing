import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  AuthAccess,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedAccess,
  validateRequest,
} from "@ticketing-srv/common";
import { Order } from "../models/order";
import { stripe } from "../Stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/PaymentCreatedPublisher";
import { nats } from "../NatsWrapper";
const router = express.Router();

router.post(
  "/api/payments",
  AuthAccess,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthorizedAccess();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Order is already cancelled");

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(nats.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ success: true, payment });
  }
);

export { router as createChargeRouter };
