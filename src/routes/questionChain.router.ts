import express, { NextFunction, Request, Response } from "express";

import { QuestionChainService } from "../services/questionChain.service";
import { validatorHandler } from "../middleware/validator.handler";
import { createQuestionChainSchema, getAllQuestionChainSchema, getQuestionChainSchema, updateQuestionChainSchema } from "../schemas/questionChain.schema";

export const router = express.Router();
const questionChainService = new QuestionChainService();

router.get("/questionnaire/questionnaireId", 
  validatorHandler(getAllQuestionChainSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { questionnaireId } = req.params;
    try {
    const qChains = await questionChainService.find(questionnaireId);
    res.json(qChains);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getQuestionChainSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const qChain = await questionChainService.findOne(id);
      res.json(qChain);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createQuestionChainSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const { questionnaireId, ...data } = body;
      const qChain = await questionChainService.create(data, questionnaireId);
      res.status(201).json({
        message: `Create`,
        data: qChain,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getQuestionChainSchema, "params"),
  validatorHandler(updateQuestionChainSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const { id } = req.params;

    try {
      const qChain = await questionChainService.update(body, id);
      res.json({
        message: `update`,
        data: qChain,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  validatorHandler(getQuestionChainSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await questionChainService.remove(id);
      res.json({
        message: `question chain #id ${id} delete`,
      });
    } catch (error) {
      next(error);
    }
  }
);
