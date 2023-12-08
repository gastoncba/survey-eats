import express, { NextFunction, Request, Response } from "express";

import { BrandsService } from "../services/brand.service";
import { createBrandSchema, updateBrandSchema, getBrandSchema, queryBrandSchema } from "../schemas/brand.schema";
import { validatorHandler } from "../middleware/validator.handler";

export const router = express.Router();
const brandService = new BrandsService();

router.get("/", validatorHandler(queryBrandSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await brandService.find(req.query);
    res.json(brands);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getBrandSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const brand = await brandService.findOne(id);
    res.json(brand);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createBrandSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const payload: any = req.user
    const userId = payload.sub
    const brand = await brandService.create(body, userId);
    res.status(201).json({
      message: `Create`,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getBrandSchema, "params"), validatorHandler(updateBrandSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const brand = await brandService.update(body, id);
    res.json({
      message: `update`,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validatorHandler(getBrandSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await brandService.remove(id);
    res.json({
      message: `brand #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/statistics/:id", validatorHandler(getBrandSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const brandStatistics = await brandService.getStatistics(id);
    res.json(brandStatistics);
  } catch (error) {
    next(error);
  }
});
