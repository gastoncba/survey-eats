import express, { NextFunction, Request, Response } from "express";

import { GiftService } from "../services/gift.service";
import { validatorHandler } from "../middleware/validator.handler";
import { createGiftSchema, getAllGiftSchema, getGiftSchema, updateGiftSchema } from "../schemas/gift.schema";

export const router = express.Router();
const giftService = new GiftService();

router.get("/questionnaire/:questionnaireId", validatorHandler(getAllGiftSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { questionnaireId } = req.params;
  try {
    const gift = await giftService.find(questionnaireId);
    res.json(gift);
  } catch (error) {
    next(error);
  }
});

router.post("", validatorHandler(createGiftSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const { questionnaireId, ...data } = body;
    const gift = await giftService.create(data, questionnaireId);
    res.json(gift);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validatorHandler(getGiftSchema, "params"), validatorHandler(updateGiftSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedGift = await giftService.update(body, id);
    res.json(updatedGift);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", validatorHandler(getGiftSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await giftService.remove(id);
    res.json({
      message: `Gift #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
