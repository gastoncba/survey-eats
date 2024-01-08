import { Request, Response, NextFunction } from "express";
import * as boom from "@hapi/boom";

import { config } from "../config/config";

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  const { apiKey } = config;
  const key = req.headers["api"];

  if (key === apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
};
