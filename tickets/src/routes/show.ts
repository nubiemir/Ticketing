import { AuthAccess } from "@ticketing-srv/common";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
const router = express.Router();

router.get(
  "/api/tickets/:id",
  AuthAccess,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.getTicket(id);
    res.send({ ticket });
  }
);

export { router as ShowTicket };
