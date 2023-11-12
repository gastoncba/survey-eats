import * as boom from "@hapi/boom";

import QuestionnaireModel from "../models/questionnaire.model";
import BrandModel from "../models/brand.model";
import QuestionChainModel from "../models/questionChain.model";
import StatisticModel from "../models/statistics.model";
import QuestionStatisticModel from "../models/questionStatistics.model";
import ConditionModel, { EntityToCompare } from "../models/condition.model";
import { OptionModel } from "../models/option.model";

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
    const brand = await BrandModel.findById(brandId);
    if (brand) {
      const questionnaires = await QuestionnaireModel.find({
        _id: { $in: brand.questionnaires },
      }).select({ questionChains: 0, gifts: 0 });
      return questionnaires;
    } else {
      throw boom.notFound(`brand #${brandId} not found`);
    }
  }

  async findOne(id: string) {
    const questionnaire = await QuestionnaireModel.findById(id)
      .populate({
        path: "questionChains",
        populate: [{ path: "question" }, { path: "positiveOptions" }, { path: "negativeOptions" }, { path: "conditions" }],
      })
      .populate("gifts");
    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return questionnaire;
  }

  async update(change: any, id: string) {
    const updateQuestionnaire = await QuestionnaireModel.findByIdAndUpdate(id, change, { new: true });
    if (!updateQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return updateQuestionnaire;
  }

  async remove(id: string) {
    const brand = await BrandModel.findOne({ questionnaires: { $in: [id] } });
    if (!brand) {
      throw boom.notFound(`brand #${id} not found`);
    }

    await BrandModel.updateOne({ _id: brand._id }, { $pull: { questionnaires: id } });

    const foundQuestionnaire = await QuestionnaireModel.findByIdAndRemove(id);
    if (!foundQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }

    const questionChainIds = foundQuestionnaire.questionChains.map((questionChain) => questionChain._id);

    await QuestionChainModel.deleteMany({ _id: { $in: questionChainIds } });
  }

  async getAnyQuestionnaire(brandId: string, questionnaireId?: string) {
    if (questionnaireId) {
      return await this.findOne(questionnaireId);
    }

    const brand = await BrandModel.findById(brandId);
    if (!brand) {
      throw boom.notFound(`brand #${brandId} not found`);
    }

    if (brand.questionnaires.length === 0) {
      throw boom.badRequest(`Empty questionnaire`);
    }

    const random = Math.floor(Math.random() * brand.questionnaires.length);
    const seletedQuestionnaireId = brand.questionnaires[random];

    return await this.findOne(seletedQuestionnaireId.toString());
  }

  incluideOption(optionId: string, options: any[]) {
    for (const opt of options) {
      if (opt.id === optionId) {
        return true;
      }
    }
    return false;
  }

  async createQuestionStatistics(answeredQuestionnaire: AnsweredQuestionnaire) {
    const { answered, questionnaireId } = answeredQuestionnaire;
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);
    const questionStatistics = await QuestionStatisticModel.findOne({
      questionnaireId,
    });

    for (const ans of answered) {
      const root = await QuestionChainModel.findOne({
        _id: ans.questionChainId,
        conditions: null,
      });
      if (root) {
        if (questionStatistics) {
          for (const chosen of ans.chosenOption) {
            if (this.incluideOption(chosen.optionId, questionStatistics.options)) {
              for (const opt of questionStatistics.options) {
                if (opt.id === chosen.optionId && opt.absoluteFrequency) {
                  opt.absoluteFrequency++;
                  if (chosen.stars != -1 && opt.totalStars) {
                    opt.totalStars += chosen.stars;
                    opt.average = opt.totalStars / opt.absoluteFrequency;
                  }
                }
              }
            } else {
              let option = {
                id: chosen.optionId,
                name: chosen.name,
                absoluteFrequency: 1,
                average: chosen.stars !== -1 ? chosen.stars : -1,
                totalStars: chosen.stars !== -1 ? chosen.stars : -1,
              };
              questionStatistics.options.push(option);
            }
          }
          await questionStatistics.save();
        } else {
          const newQuestionStatistics = new QuestionStatisticModel({});
          newQuestionStatistics.questionId = root.id;
          newQuestionStatistics.questionnaireId = questionnaire?.id;
          for (const chosen of ans.chosenOption) {
            let selectedOpt = {
              id: chosen.optionId,
              name: chosen.name,
              absoluteFrequency: 1,
              average: chosen.stars !== -1 ? chosen.stars : -1,
              totalStars: chosen.stars !== -1 ? chosen.stars : -1,
              //subOptions: []
            };
            newQuestionStatistics.options.push(selectedOpt);
          }
          await newQuestionStatistics.save();
        }
      } else {
        //aca en una answered options
      }
    }
  }

  async sendQuestionnaireAnswered(data: { questionnaireId: string; brandId: string; answeredQuestionnaire: AnsweredQuestionnaire }) {
    const { brandId, questionnaireId, answeredQuestionnaire } = data;

    const statistics = await StatisticModel.findOne({ brandId });
    if (!statistics) {
      const newStatistic = new StatisticModel({});
      newStatistic.answeredQuestionnaires++;
      await newStatistic.save();
    } else {
      statistics.answeredQuestionnaires++;
      statistics.save();
    }

    await this.createQuestionStatistics(answeredQuestionnaire);
  }
}

/* ----------- INTERFACE ----------- */

interface AnsweredQuestionnaire {
  answered: AnsweredQuestionChain[];
  questionnaireId: string;
}

interface AnsweredQuestionChain {
  questionChainId: string;
  titleQuestion: string;
  chosenOption: { optionId: string; stars: number; name: string }[];
}
