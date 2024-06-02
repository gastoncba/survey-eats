import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { AuthService } from "../services/auth.service";
import { validatorHandler } from "../middleware/validator.handler";
import { changePasswordSchema, loginSchema, recoverySchema } from "../schemas/auth.schema";

export const router = express.Router();
const authService = new AuthService();

router.post("/login", validatorHandler(loginSchema, "body"), passport.authenticate("local", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = req.user;
    res.json(authService.signToken(user));
  } catch (error) {
    next(error);
  }
});

router.post("/recovery", validatorHandler(recoverySchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, url } = req.body;
    const rta = await authService.sendRecovery(email, url);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", validatorHandler(changePasswordSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    res.json(await authService.changePassword(token, newPassword));
  } catch (error) {
    next(error);
  }
});
