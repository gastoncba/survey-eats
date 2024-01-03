import * as boom from "@hapi/boom";

import QuestionChainModel from "../models/questionChain.model";
import QuestionnaireModel from "../models/questionnaire.model";

export class QuestionChainService {
  private static instance: QuestionChainService;

  private constructor() {}

  public static getInstance(): QuestionChainService {
    if (!QuestionChainService.instance) {
      QuestionChainService.instance = new QuestionChainService();
    }
    return QuestionChainService.instance;
  }

  async create(data: any, questionnaireId: string) {
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);
    if (questionnaire) {
      const qChain = new QuestionChainModel(data);
      await qChain.save();
      questionnaire.questionChains.push(qChain._id);
      await questionnaire.save();
      return qChain;
    } else {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    }
  }

  async find(questionnaireId: string) {
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);

    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    }

    return await QuestionChainModel.find({
      _id: { $in: questionnaire.questionChains },
    })
      .populate("question")
      .populate("positiveOptions")
      .populate("negativeOptions")
      .populate("conditions");
  }

  async findOne(id: string) {
    const qChain = await QuestionChainModel.findById(id).select({ brandId: 0 });
    if (!qChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
    return qChain;
  }

  async update(change: any, id: string) {
    const updateQChain = await QuestionChainModel.findByIdAndUpdate(id, change, { new: true });
    if (!updateQChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
    return updateQChain;
  }

  async remove(id: string) {
    const foundQuestionnaire = await QuestionnaireModel.findOne({
      questionChains: { $in: [id] },
    });

    if (!foundQuestionnaire) {
      throw boom.notFound(`questionnaire not found`);
    }

    await QuestionnaireModel.updateOne({ _id: foundQuestionnaire._id }, { $pull: { questionChains: id } });

    const deletedQChain = await QuestionChainModel.findByIdAndRemove(id);
    if (!deletedQChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
  }
}
