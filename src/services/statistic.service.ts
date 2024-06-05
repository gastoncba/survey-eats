import StatisticModel from "../models/statistics.model";
import QuestionStatisticModel from "../models/questionStatistics.model";

import QuestionChainModel from "../models/questionChain.model";
import ConditionModel from "../models/condition.model";
import QuestionModel from "../models/question.model";
import QuestionnaireModel from "../models/questionnaire.model";
import { DinersServices } from "./diner.service";

const dinersServices = new DinersServices();

export class StatisticService {
  constructor() {}

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

    for (const ansOptModel of ansOptionsModel) {
      for (const a of answered) {
        if (ansOptModel._id.toString() === a.questionChainId) {
          const condition = await ConditionModel.findById(ansOptModel.conditions[0]._id);
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
                    if (o.answeredOption === opt.id) {
                      for (const chosen of o.chosenOption) {
                        let index = opt.subOptions.findIndex((sub) => sub.id === chosen.optionId);
                        if (index !== -1) {
                          //@ts-ignore
                          opt.subOptions[index].absoluteFrequency += 1;
                        } else {
                          let subOption: SubOption = {
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
                if (o.answeredOption === chosen.optionId) {
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
          const rootQuestion = await QuestionModel.findById(root.question);
          newQuestionStatistics.question = rootQuestion?._id;
          newQuestionStatistics.questionnaireId = questionnaire?._id;

          for (const chosen of ans.chosenOption) {
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
              if (o.answeredOption === chosen.optionId) {
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
            newQuestionStatistics.options.push(option);
          }
          await newQuestionStatistics.save();
        }
      }
    }
  }

  async saveStatistics(data: { questionnaireId: string; brandId: string; answeredQuestionnaire: AnsweredQuestionnaire }) {
    const { brandId, answeredQuestionnaire, questionnaireId } = data;

    await this.createQuestionStatistics(answeredQuestionnaire);

    /** Encontramos la instancia de questionStatistic por questionnaireId */
    const foundedQuestionStatistic = await QuestionStatisticModel.findOne({ questionnaireId });

    const statistics = await StatisticModel.findOne({ brandId });
    if (!statistics) {
      const newStatistic = new StatisticModel({ brandId, answeredQuestionnaires: 1, questionStatistics: [foundedQuestionStatistic?.id] });
      await newStatistic.save();
    } else {
      statistics.answeredQuestionnaires++;

      const index = statistics.questionStatistics.findIndex(
        //@ts-ignore
        (element) => element._id.equals(foundedQuestionStatistic?._id)
      );

      if (index !== -1) {
        //@ts-ignore
        statistics.questionStatistics[index] = foundedQuestionStatistic;
      } else {
        //@ts-ignore
        statistics.questionStatistics.push(foundedQuestionStatistic);
      }

      await statistics.save();
    }
  }

  calculateAverageStars(questionStatistics: any[]) {
    let totalStarsSum = 0;
    let statisticsWithStarsCount = 0;

    questionStatistics.forEach((statistics) => {
      if (statistics.options && statistics.options.length > 0) {
        statistics.options.forEach((option: any) => {
          if (option.totalStars !== -1) {
            totalStarsSum += option.totalStars;
            statisticsWithStarsCount += 1;
          }
        });
      }
    });

    const averageStars = statisticsWithStarsCount > 0 ? totalStarsSum / statisticsWithStarsCount : 0;
    return averageStars;
  }

  async getStatistics(brandId: string) {
    const statistics = await StatisticModel.findOne({ brandId })
      .populate({ path: "questionStatistics", populate: [{ path: "questionnaireId" }, { path: "question" }] })
      .select({ brandId: 0 })
      .exec();

    const average = this.calculateAverageStars(statistics ? statistics.questionStatistics : []);

    return {
      _id: statistics ? statistics._id : "",
      answeredQuestionnaires: statistics ? statistics.answeredQuestionnaires : 0,
      repurchases: statistics ? statistics.repurchases : 0,
      averageStars: statistics ? average : 0,
      questionStatistics: statistics ? statistics.questionStatistics : [],
    };
  }

  async calculateRepurchases(email: string, brandId: string) {
    const statistics = await StatisticModel.findOne({ brandId });

    if (statistics) {
      const existsDiner = await dinersServices.exists(email);
      if (existsDiner) {
        const visitedBrand = await dinersServices.visited(email, brandId);
        if (visitedBrand) {
          statistics.repurchases++;
          statistics.save();
        } else {
          dinersServices.addBrand(email, brandId);
        }
      } else {
        await dinersServices.create(email, brandId);
      }
    }
  }
}

/* ----------- INTERFACE ----------- */

export interface AnsweredQuestionnaire {
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
