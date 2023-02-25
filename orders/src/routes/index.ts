import { AuthAccess } from "@ticketing-srv/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", AuthAccess, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send({ orders });
});

export { router as ShowAllOrders };
