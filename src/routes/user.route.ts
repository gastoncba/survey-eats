import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { UserService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { validatorHandler } from "../middleware/validator.handler";

export const router = express.Router();
const userService = new UserService();

router.post("/create", validatorHandler(createUserSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const user = await userService.create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = req.user;
    const userId = payload.sub;
    const user = await userService.findById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/update", passport.authenticate("jwt", { session: false }), validatorHandler(updateUserSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = req.user;
    const userId = payload.sub;
    const { brandId, ...changes } = req.body;
    const updatedUser = await userService.updateAll(userId, brandId, changes);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});
