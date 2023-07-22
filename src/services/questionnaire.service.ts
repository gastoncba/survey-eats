import * as boom from "@hapi/boom";

import QuestionnaireModel from "../models/questionnaire.model";
import BrandModel from "../models/brand.model";

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
    const brand = await BrandModel.findById(brandId).select('questionnaires').exec()
    if(brand) {
      const questionnaires = await QuestionnaireModel.find({ _id: { $in: brand.questionnaires } }).select({questionChains: 0 });
      return questionnaires;
    } else {
      throw boom.notFound(`brand #${brandId} not found`);
    };
  }

  async findOne(id: string) {
    const questionnaire = await QuestionnaireModel.findById(id)
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
    const foundQuestionnaire = await QuestionnaireModel.findById(id);
    if (!foundQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return await QuestionnaireModel.deleteOne({ _id: id });
  }
}
