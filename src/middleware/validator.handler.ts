import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import * as boom from "@hapi/boom";

export const validatorHandler = (schema: Schema, property: "params" | "body" | "query") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      next(boom.badRequest(error.message));
    }
    next();
  };
};
