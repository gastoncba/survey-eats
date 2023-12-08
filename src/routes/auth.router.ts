import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { config } from "../config/config";

export const router = express.Router();

router.post("/login", passport.authenticate("local", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = req.user;
    const payload = {
      sub: user._id,
    };
    const { jwtSecret } = config;
    const userReturned = user.toJSON();
    delete userReturned.password;
    const access_token = jwt.sign(payload, jwtSecret);
    res.json({ user: userReturned, token: { access_token } });
  } catch (error) {
    next(error);
  }
});
