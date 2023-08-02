import * as boom from "@hapi/boom";

import QuestionnaireModel from "../models/questionnaire.model";
import BrandModel from "../models/brand.model";
import { Schema } from "mongoose";
import QuestionChainModel from "../models/questionChain.model";

type QuestionChainEntity = {
  question: {
    type: Schema.Types.ObjectId;
    ref: "Question";
  };
  positiveOptions: Array<Schema.Types.ObjectId>;
  negativeOptions: Array<Schema.Types.ObjectId> | null;
  acceptStars: boolean;
  conditions: Array<Schema.Types.ObjectId> | null;
};

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
      .select("questionnaires")
      .exec();
    if (brand) {
      const questionnaires = await QuestionnaireModel.find({
        _id: { $in: brand.questionnaires },
      }).select({ questionChains: 0 });
      return questionnaires;
    } else {
      throw boom.notFound(`brand #${brandId} not found`);
    }
  }

  async findOne(id: string) {
    const questionnaire = await QuestionnaireModel.findById(id).populate(
      { path: 'questionChains' , 
      populate: [
        {path: 'question' }, 
        {path: 'positiveOptions'},
        {path: 'negativeOptions'},
        {path: 'conditions'}
    ]
  });
    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }
    return questionnaire
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

  async findQuestionChain(toFind: QuestionChainEntity) {
    const qChain = await QuestionChainModel.findOne({
      question: toFind.question,
      positiveOptions: { $all: toFind.positiveOptions },
      negativeOptions: { $all: toFind.negativeOptions },
      acceptStars: toFind.acceptStars,
      conditions: {
        $in: [toFind.conditions],
        $exists: toFind.conditions === null
      }
    })

    return qChain;
  }

  async addQuestionChains(qChains: QuestionChainEntity[], id: string) {

    try {
      const questionnaire = await QuestionnaireModel.findById(id);
      if (!questionnaire) {
        throw boom.notFound(`questionnaire #${id} not found`);
      }

      let idQCSelects: string[] = [];
      for (const qChain of qChains) {
        const foundQChain = await this.findQuestionChain(qChain);
        if (!foundQChain) {
          const newQChain = new QuestionChainModel({
            ...qChain,
            questionnaireId: id,
          });
          await newQChain.save();
          questionnaire.questionChains.push(newQChain._id);
          idQCSelects.push(newQChain._id.toString());
        } else {
          const foundInQuestionnaire = questionnaire.questionChains.find(
            (qc) => qc._id.toString() === foundQChain._id.toString()
          );
          if (!foundInQuestionnaire) {
            questionnaire.questionChains.push(foundQChain._id);
          }
          idQCSelects.push(foundQChain._id.toString());
        }
        await questionnaire.save();
      }

      for (const qc of questionnaire.questionChains) {
        const found = idQCSelects.find(
          (selected) => selected === qc._id.toString()
        );
        if (!found) {
          const deletedQC = QuestionChainModel.findByIdAndRemove({
            id: qc._id.toString(),
          });
          if (!deletedQC) {
            throw boom.notFound(`question chain #${id} not found`);
          }
        }
      }

    } catch (error) {
      throw boom.badRequest("Error: " + error);
    }
  }
}
