import * as boom from "@hapi/boom";

import QuestionModel from "../models/question.model";
import QuestionChainModel from "../models/questionChain.model";

export class QuestionsService {
  private static instance: QuestionsService;

  private constructor() {}

  public static getInstance(): QuestionsService {
    if (!QuestionsService.instance) {
      QuestionsService.instance = new QuestionsService();
    }
    return QuestionsService.instance;
  }

  async create(data: any) {
    const question = new QuestionModel(data);
    return await question.save();
  }

  async find(brandId: string) {
    const questions = await QuestionModel.find({ brandId }).select({ brandId: 0 });
    return questions;
  }

  async findOne(id: string) {
    const question = await QuestionModel.findById(id).select({ brandId: 0 });
    if (!question) {
      throw boom.notFound(`question #${id} not found`);
    }
    return question;
  }

  async update(change: any, id: string) {
    const updateQuestion = await QuestionModel.findByIdAndUpdate(id, change, { new: true });
    if (!updateQuestion) {
      throw boom.notFound(`question #${id} not found`);
    }
    return updateQuestion;
  }

  async remove(id: string) {
    const foundQChain = await QuestionChainModel.find({ question: id });
    if (foundQChain.length > 0) {
      throw boom.badRequest("Esta pregunta esta siendo usada en otro cuestionario");
    }

    const foundQuestion = await QuestionModel.findByIdAndDelete(id);
    if (!foundQuestion) {
      throw boom.notFound(`question #${id} not found`);
    }
  }
}
