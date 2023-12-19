import express, { Express } from "express";
import passport from "passport";

import { router as questionRouter } from "./question.router";
import { router as optionRouter } from "./option.router";
import { router as brandRouter } from "./brand.router";
import { router as questionnaireRouter } from "./questionnaire.router";
import { router as questionChainRouter } from "./questionChain.router";
import { router as conditionRouter } from "./condition.router";
import { router as giftRouter } from "./gift.router";
//import { router as userRouter } from "./user.route";
import { router as authRouter } from "./auth.router";

export const routerApi = (app: Express) => {
  const router = express.Router();
  app.use("/api", router);
  router.use("/questions", passport.authenticate("jwt", { session: false }), questionRouter);
  router.use("/options", passport.authenticate("jwt", { session: false }), optionRouter);
  router.use("/brands", passport.authenticate("jwt", { session: false }), brandRouter);
  router.use("/questionnaires", questionnaireRouter);
  router.use("/questionChains", passport.authenticate("jwt", { session: false }), questionChainRouter);
  router.use("/conditions", passport.authenticate("jwt", { session: false }), conditionRouter);
  router.use("/gifts", passport.authenticate("jwt", { session: false }), giftRouter);
  //router.use("/user", userRouter);
  router.use("/auth", authRouter);
};
