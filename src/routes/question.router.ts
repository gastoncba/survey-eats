import express, { NextFunction, Request, Response } from "express";

import { QuestionsService } from "../services/question.service";
import {
  createQuestionSchema,
  getQuestionSchema,
  queryQuestionSchema,
  updateQuestionSchema,
} from "../schemas/question.schema";
import { validatorHandler } from "../middleware/validator.handler";

export const router = express.Router();
const questionService = new QuestionsService();

router.get(
  "/",
  validatorHandler(queryQuestionSchema, "query"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const questions = await questionService.find(req.query);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  validatorHandler(getQuestionSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const question = await questionService.findOne(id);
      res.json(question);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createQuestionSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    try {
      const question = await questionService.create(body);
      res.status(201).json({
        message: `Create`,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validatorHandler(getQuestionSchema, "params"),
  validatorHandler(updateQuestionSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { id } = req.params;

    try {
      const question = await questionService.update(body, id);
      res.json({
        message: `update`,
        data: question,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  validatorHandler(getQuestionSchema, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await questionService.remove(id);
      res.json({
        message: `question #id ${id} delete`,
      });
    } catch (error) {
      next(error);
    }
  }
);
