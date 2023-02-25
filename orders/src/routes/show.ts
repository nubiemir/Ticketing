import {
  AuthAccess,
  NotFoundError,
  UnauthorizedAccess,
} from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
const router = express.Router();

router.get(
  "/api/orders/:id",
  AuthAccess,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new NotFoundError();
    const order = await Order.findById(id).populate("ticket");
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthorizedAccess();
    res.send({ order });
  }
);

export { router as ShowOrder };
