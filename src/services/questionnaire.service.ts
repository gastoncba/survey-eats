import * as boom from "@hapi/boom";

import QuestionnaireModel from "../models/questionnaire.model";
import BrandModel from "../models/brand.model";
import QuestionChainModel from "../models/questionChain.model";
import StatisticModel from "../models/statistics.model";
import mongoose from "mongoose";

export class QuestionnaireService {
  constructor() {}

  async create(data: any, brandId: string) {
    const questionnaire = new QuestionnaireModel(data);
    await questionnaire.save();

    const brand = await BrandModel.findById(brandId);
    if (brand) {
      brand.questionnaires.push(questionnaire._id);
      await brand.save();
    } else {
      throw boom.notFound(`brand #${brandId} not found`);
    }

    return questionnaire;
  }

  async find(brandId: string) {
    const brand = await BrandModel.findById(brandId)
    if (brand) {
      const questionnaires = await QuestionnaireModel.find({
        _id: { $in: brand.questionnaires },
      }).select({ questionChains: 0, gifts: 0});
      return questionnaires;
    } else {
      throw boom.notFound(`brand #${brandId} not found`);
    }
  }

  async findOne(id: string) {
    const questionnaire = await QuestionnaireModel.findById(id).populate({
      path: "questionChains",
      populate: [
        { path: "question" },
        { path: "positiveOptions" },
        { path: "negativeOptions" },
        { path: "conditions" },
      ],
    }).populate('gifts');
    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return questionnaire;
  }

  async update(change: any, id: string) {
    const updateQuestionnaire = await QuestionnaireModel.findByIdAndUpdate(
      id,
      change,
      { new: true }
    );
    if (!updateQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return updateQuestionnaire;
  }

  async remove(id: string) {

    const brand = await BrandModel.findOne({ questionnaires: {$in: [id]}})
    if(!brand) {
      throw boom.notFound(`brand #${id} not found`);
    }

    await BrandModel.updateOne(
      {_id: brand._id}, 
      { $pull: { questionnaires: id } }
    )
    
    const foundQuestionnaire = await QuestionnaireModel.findByIdAndRemove(id);
    if (!foundQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }

    const questionChainIds = foundQuestionnaire.questionChains.map(
      (questionChain) => questionChain._id
    );

    await QuestionChainModel.deleteMany({ _id: { $in: questionChainIds } });
    
  }

  async getAnyQuestionnaire(brandId: string) {
    const brand = await BrandModel.findById(brandId)
    if(!brand) {
      throw boom.notFound(`brand #${brandId} not found`)
    }

    if(brand.questionnaires.length === 0) {
      throw boom.badRequest(`Empty questionnaire`)
    }

    const random = Math.floor(Math.random() * brand.questionnaires.length)
    const seletedQuestionnaireId = brand.questionnaires[random]
    
    return await this.findOne(seletedQuestionnaireId.toString())
  }

  async sendQuestionnaireAnswered(data: {questionnaireId: string, brandId: string}) {
    const { brandId, questionnaireId  } = data
    const statistics = await StatisticModel.findOne({ brandId })
    if(!statistics) {
      const newStatistic = new StatisticModel(data)
      newStatistic.answeredQuestionnaires++;
      await newStatistic.save()
    } else {
      statistics.answeredQuestionnaires++;
      statistics.save()
    }
  }
}
