import express, { Request, Response, NextFunction } from "express";

import { OptionService } from "../services/option.service";
import { validatorHandler } from "../middleware/validator.handler";
import { createOptionSchema, getOptionSchema, updateOptionSchema, getAllOptionSchema } from "../schemas/option.schema";

export const router = express.Router();
const optionService = new OptionService();

router.get("/brand/:brandId", validatorHandler(getAllOptionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { brandId } = req.params;
  try {
    const options = await optionService.find(brandId);
    res.json(options);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getOptionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const option = await optionService.findOne(id);
    res.json(option);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createOptionSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    const option = await optionService.create(body);
    res.status(201).json(option);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getOptionSchema, "params"), validatorHandler(updateOptionSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const option = await optionService.update(body, id);
    res.json(option);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validatorHandler(getOptionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await optionService.remove(id);
    res.json({
      message: `option #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
