import * as boom from "@hapi/boom";

import QuestionChainModel from "../models/questionChain.model";
import QuestionnaireModel from "../models/questionnaire.model";

export class QuestionChainService {
  constructor() {}

  async create(data: any, questionnaireId: string) {
    const qChain = new QuestionChainModel(data);
    await qChain.save();

    const questionnaire = await QuestionnaireModel.findById(questionnaireId);
    if (questionnaire) {
      questionnaire.questionChains.push(qChain._id);
      await questionnaire.save();
    } else {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    }

    return qChain;
  }

  async find(questionnaireId: string) {
    const questionnaire = await QuestionnaireModel.findById(questionnaireId)
    if(questionnaire) {
      const qChains = await QuestionChainModel.find({ _id: { $in: questionnaire.questionChains } });
      return qChains;
    } else {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    };
  }

  async findOne(id: string) {
    const qChain = await QuestionChainModel.findById(id).select({ brandId: 0 });
    if (!qChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
    return qChain;
  }

  async update(change: any, id: string) {
    const updateQChain = await QuestionChainModel.findByIdAndUpdate(
      id,
      change,
      { new: true }
    );
    if (!updateQChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
    return updateQChain;
  }

  async remove(id: string) {
    const foundQChain = await QuestionChainModel.findById(id);
    if (!foundQChain) {
      throw boom.notFound(`question chain #${id} not found`);
    }
    return await foundQChain.deleteOne({ _id: id });
  }
}
