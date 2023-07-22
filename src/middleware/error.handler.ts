import { Request, Response, NextFunction } from "express";

export const logError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(err);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    message: err.message
  });
};

export const boomErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload)
  }
  next(err)
};
