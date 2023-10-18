import * as boom from "@hapi/boom";

//import GiftModel from "../models/gift.model";
import QuestionnaireModel from "../models/questionnaire.model";

export class GiftService {
  constructor() {}

  async find(questionnaireId: string) {
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);
    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    }

    //return await GiftModel.find({ _id: { $in: questionnaire.gifts } });
  }

  async create(data: any, questionnaireId: string) {
    const questionnaire = await QuestionnaireModel.findById(questionnaireId);

    if (!questionnaire) {
      throw boom.notFound(`questionnaire #${questionnaireId} not found`);
    }

    // const gift = new GiftModel(data);
    // await gift.save();

    // questionnaire.gifts.push(gift._id);
    // await questionnaire.save();
    // return gift;
  }

  async update(change: any, id: string) {
    // const updateGift = await GiftModel.findByIdAndUpdate(id, change, {
    //   new: true,
    // });
    // if (!updateGift) {
    //   throw boom.notFound(`gift #${id} not found`);
    // }
    // return updateGift;
  }

  async remove(id: string) {
    const foundQuestionnaire = await QuestionnaireModel.findOne({
        gifts: { $in: [id] },
      });
  
      if (!foundQuestionnaire) {
        throw boom.notFound(`questionnaire not found`);
      }
  
      await QuestionnaireModel.updateOne(
        { _id: foundQuestionnaire._id },
        { $pull: { gifts: id } }
      );
  
      //const deletedGift = await GiftModel.findByIdAndRemove(id);
      // if (!deletedGift) {
      //   throw boom.notFound(`gift chain #${id} not found`);
      // }
  }
}
