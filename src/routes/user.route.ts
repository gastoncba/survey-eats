import express, { NextFunction, Request, Response } from "express";

import { UserService } from "../services/user.service";
import { createUserSchema } from "../schemas/user.schema";
import { validatorHandler } from "../middleware/validator.handler";

export const router = express.Router();
const userService = new UserService();

router.post("/create", validatorHandler(createUserSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const user = await userService.create(body);
    res.status(201).json({
      message: `Create`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
