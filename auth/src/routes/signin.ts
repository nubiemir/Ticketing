import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@ticketing-srv/common";

import { User } from "../models/user";
import { Password } from "../services/Password";

const router = express.Router();

router.post(
  "/api/users/sign-in",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("Sorry invalid credentials");

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) throw new BadRequestError("Sorry invalid credentials");

    const usrJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    // store it on session object
    req.session = {
      jwt: usrJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
