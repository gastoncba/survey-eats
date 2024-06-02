import * as boom from "@hapi/boom";

import QuestionnaireModel from "../models/questionnaire.model";
import BrandModel from "../models/brand.model";
import QuestionChainModel from "../models/questionChain.model";
import QuestionStatisticModel from "../models/questionStatistics.model";
import GiftModel from "../models/gift.model";
import { GiftService } from "./gift.service";
import { EmailService } from "./email.service";
import { StatisticService, AnsweredQuestionnaire } from "./statistic.service";

const giftService = new GiftService();
const emailService = new EmailService();
const statisticService = new StatisticService();

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
      .populate("gifts").exec();
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
      throw boom.notFound(`questionnaire #${id} not found in brand`);
    }

    await BrandModel.updateOne({ _id: brand._id }, { $pull: { questionnaires: id } });

    const foundQuestionnaire = await QuestionnaireModel.findByIdAndRemove(id);
    if (!foundQuestionnaire) {
      throw boom.notFound(`questionnaire #${id} not found`);
    }

    const questionChainIds = foundQuestionnaire.questionChains.map((questionChain) => questionChain._id);
    const questionGifts = foundQuestionnaire.gifts.map((gift) => gift._id);

    await QuestionChainModel.deleteMany({ _id: { $in: questionChainIds } });
    await GiftModel.deleteMany({ _id: { $in: questionGifts } });

    /*Eliminamos question statistic de ese cuestionario*/
    await QuestionStatisticModel.deleteOne({ questionnaireId: foundQuestionnaire._id });
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

  async sendQuestionnaireAnswered(data: { questionnaireId: string; brandId: string; answeredQuestionnaire: AnsweredQuestionnaire }) {
    await statisticService.saveStatistics(data);
  }

  async sendGifts(giftsId: string[], email: string, brandId: string) {
    const gifts = await giftService.findGifts(giftsId);
    await statisticService.calculateRepurchases(email, brandId); 

    let html = `
        <div style="font-family: 'Arial', sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #009688;">¡Tus Premios!</h2>
            <p>¡Gracias por contestar nuestra encuesta! Aquí están tus premios:</p>
            <ul style="list-style-type: none; padding: 0;">
    `;

    gifts.forEach((gift) => {
      const currentDate = new Date();
      const validDays = gift.validDays || 0;
      const expirationDate = new Date(currentDate.getTime() + validDays * 24 * 60 * 60 * 1000);
      const formattedExpirationDate = `${expirationDate.getDate()}/${expirationDate.getMonth() + 1}/${expirationDate.getFullYear()}`;
      html += `
            <li style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <h3>${gift.name}</h3>
                <p>${gift.description}</p>
                <p><em>Valido hasta el ${formattedExpirationDate}</em></p>
            </li>
        `;
    });

    html += `
            </ul>
            <p style="margin-top: 20px;">¡Esperamos que disfrutes de tus premios!</p>
        </div>
    `;
    await emailService.sendEmail(email, "¡Tus Premios!", html);
  }
}
