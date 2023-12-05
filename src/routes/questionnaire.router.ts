import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { QuestionnaireService } from "../services/questionnaire.service";
import { validatorHandler } from "../middleware/validator.handler";
import { createQuestionnaireSchema, getAllQuestionnaireSchema, getQuestionnaireSchema, updateQuestionnaireSchema, createStatisticsSchema, queryQuestionnaireIdSchema } from "../schemas/questionnaire.schema";

export const router = express.Router();
const questionnaireService = new QuestionnaireService();

router.get("/brand/:brandId", passport.authenticate("jwt", { session: false }), validatorHandler(getAllQuestionnaireSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { brandId } = req.params;
  try {
    const questionnaires = await questionnaireService.find(brandId);
    res.json(questionnaires);
  } catch (error) {
    next(error);
  }
});

router.get("/answer/:brandId", validatorHandler(getAllQuestionnaireSchema, "params"), validatorHandler(queryQuestionnaireIdSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  const { brandId } = req.params;
  const { id } = req.query;
  const questionnaireId = id ? (id as string) : undefined;
  try {
    const questionnaire = await questionnaireService.getAnyQuestionnaire(brandId, questionnaireId);
    res.json(questionnaire);
  } catch (error) {
    next(error);
  }
});

router.post("/send", validatorHandler(createStatisticsSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
  const { brandId, questionnaireId, answeredQuestionnaire } = req.body;
  try {
    await questionnaireService.sendQuestionnaireAnswered({ brandId, questionnaireId, answeredQuestionnaire });
    res.json({ message: "save" });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getQuestionnaireSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const questionnaire = await questionnaireService.findOne(id);
    res.json(questionnaire);
  } catch (error) {
    next(error);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), validatorHandler(createQuestionnaireSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
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
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getQuestionnaireSchema, "params"), validatorHandler(updateQuestionnaireSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
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
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getQuestionnaireSchema, "params"), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await questionnaireService.remove(id);
    res.json({
      message: `questionnaire #id ${id} delete`,
    });
  } catch (error) {
    next(error);
  }
});
