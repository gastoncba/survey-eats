import express, { NextFunction, Request, Response } from "express";

import { validatorHandler } from "../middleware/validator.handler";
import { ConditionService } from "../services/condition.service";
import { createConditionSchema, getAllConditionSchema, getConditionSchema, updateConditionSchema } from "../schemas/condition.schema";

export const router = express.Router();
const conditionService = new ConditionService();

router.get("/brand/:brandId", validatorHandler(getAllConditionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { brandId } = req.params;
  try {
    const condition = await conditionService.find(brandId);
    res.json(condition);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getConditionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const condition = await conditionService.findOne(id);
    res.json(condition);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createConditionSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  try {
    const condition = await conditionService.create(body);
    res.status(201).json(condition);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getConditionSchema, "params"), validatorHandler(updateConditionSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { id } = req.params;

  try {
    const updatedCondition = await conditionService.update(body, id);
    res.json(updatedCondition);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validatorHandler(getConditionSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await conditionService.remove(id);
    res.json({
      message: `condition #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
