import express, { Request, Response } from "express";
import { body } from "express-validator";
import Jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@ticketing-srv/common";
import { User } from "../models/user";
const router = express.Router();

router.post(
  "/api/users/sign-up",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 charachters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user.save();

    //Hrmrtsyr JWT
    const usrJwt = Jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    // store it on session object
    req.session = {
      jwt: usrJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
