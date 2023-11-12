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

    const questionaChainsId = answered.map((ans) => ans.questionChainId);

    let answeredOptions: AnsweredOption[] = [];
    const ansOptionsModel = await QuestionChainModel.find({ _id: { $in: questionaChainsId }, conditions: { $ne: null } });

    for (const ansOpt of ansOptionsModel) {
      for (const a of answered) {
        if (ansOpt._id.toString() === a.questionChainId) {
          const condition = await ConditionModel.findById(ansOpt.conditions[0]._id);
          if (condition) {
            let ansOptions: AnsweredOption = {
              ...a,
              answeredOption: condition.value ? condition.value : "",
            };
            answeredOptions.push(ansOptions);
          }
        }
      }
    }

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

                  //se buscan las subOptions
                  for (const o of answeredOptions) {
                    if (o.answeredOption === opt.name) {
                      for (const chosen of o.chosenOption) {
                        let index = opt.subOptions.findIndex((sub) => sub.id === chosen.optionId);
                        if (index !== -1) {
                          //@ts-ignore
                          opt.subOptions[index].absoluteFrequency += 1;
                        } else {
                          let subOption:SubOption = {
                            id: chosen.optionId,
                            name: chosen.name,
                            absoluteFrequency: 1,
                            question: o.titleQuestion,
                          };
                          opt.subOptions.push(subOption);
                        }
                      }
                    }
                  }
                }
              }
            } else {
              let subOptions: SubOption[] = [];

              const option = {
                id: chosen.optionId,
                name: chosen.name,
                absoluteFrequency: 1,
                average: chosen.stars !== -1 ? chosen.stars : -1,
                totalStars: chosen.stars !== -1 ? chosen.stars : -1,
                subOptions: subOptions,
              };

              for (const o of answeredOptions) {
                if (o.answeredOption === chosen.name) {
                  for (const ch of o.chosenOption) {
                    let subOption: SubOption = {
                      id: ch.optionId,
                      name: ch.name,
                      absoluteFrequency: 1,
                      question: o.titleQuestion,
                    };
                    option.subOptions.push(subOption);
                  }
                }
              }
              questionStatistics.options.push(option);
            }
          }
          await questionStatistics.save();
        } else {
          const newQuestionStatistics = new QuestionStatisticModel({});
          newQuestionStatistics.questionId = root.id;
          newQuestionStatistics.questionnaireId = questionnaire?.id;

          let subOptions: SubOption[] = [];

          for (const chosen of ans.chosenOption) {
            let selectedOpt = {
              id: chosen.optionId,
              name: chosen.name,
              absoluteFrequency: 1,
              average: chosen.stars !== -1 ? chosen.stars : -1,
              totalStars: chosen.stars !== -1 ? chosen.stars : -1,
              subOptions: subOptions,
            };

            for (const o of answeredOptions) {
              if (o.answeredOption === chosen.name) {
                for (const ch of o.chosenOption) {
                  let subOption = {
                    id: ch.optionId,
                    name: ch.name,
                    absoluteFrequency: 1,
                    question: o.titleQuestion,
                  };
                  selectedOpt.subOptions.push(subOption);
                }
              }
            }

            newQuestionStatistics.options.push(selectedOpt);
          }
          await newQuestionStatistics.save();
        }
      }
    }
  }

  async sendQuestionnaireAnswered(data: { questionnaireId: string; brandId: string; answeredQuestionnaire: AnsweredQuestionnaire }) {
    const { brandId, answeredQuestionnaire } = data;

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

interface AnsweredOption extends AnsweredQuestionChain {
  answeredOption: string;
}

interface SubOption {
  question: string;
  id: string;
  name: string;
  absoluteFrequency: number;
}
