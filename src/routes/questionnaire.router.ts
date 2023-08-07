import express, { NextFunction, Request, Response } from "express";

import { QuestionnaireService } from "../services/questionnaire.service";
import { validatorHandler } from "../middleware/validator.handler";
import { addQuestionChainsSchema, createQuestionnaireSchema, getAllQuestionnaireSchema, getQuestionnaireSchema, updateQuestionnaireSchema } from "../schemas/questionnaire.schema";

export const router = express.Router();
const questionnaireService = new QuestionnaireService();

router.get("/brand/:brandId", 
  validatorHandler(getAllQuestionnaireSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { brandId } = req.params;
    try {
    const questionnaires = await questionnaireService.find(brandId);
    res.json(questionnaires);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getQuestionnaireSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const questionnaire = await questionnaireService.findOne(id);
      res.json(questionnaire);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createQuestionnaireSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const { brandId, ...data } = body;
      const questionnaire = await questionnaireService.create(data, brandId);
      res.status(201).json({
        message: `Create`,
        data: questionnaire,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getQuestionnaireSchema, "params"),
  validatorHandler(updateQuestionnaireSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { id } = req.params;

    try {
      const questionnaire = await questionnaireService.update(body, id);
      res.json({
        message: `update`,
        data: questionnaire,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  validatorHandler(getQuestionnaireSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await questionnaireService.remove(id);
      res.json({
        message: `questionnaire #id ${id} delete`,
      });
    } catch (error) {
      next(error);
    }
  }
);
