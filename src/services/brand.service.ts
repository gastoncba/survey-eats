import * as boom from "@hapi/boom";
import QueryString from "qs";

import BrandModel from "../models/brand.model";
import QuestionnaireModel from "../models/questionnaire.model";
import UserModel from "../models/user.model";
import { StatisticService } from "./statistic.service";

const statisticService = StatisticService.getInstance();

export class BrandsService {
  private static instance: BrandsService;

  private constructor() {}

  public static getInstance(): BrandsService {
    if (!BrandsService.instance) {
      BrandsService.instance = new BrandsService();
    }
    return BrandsService.instance;
  }

  async find(query: QueryString.ParsedQs) {
    const { name } = query;

    const brands = await BrandModel.find(name ? { name } : {}).select({ questionnaires: 0 });
    return brands;
  }

  async findOne(id: string) {
    const brand = await BrandModel.findById(id).select({ questionnaires: 0 });
    if (!brand) {
      throw boom.notFound(`brand #${id} not found`);
    }
    return brand;
  }

  async create(data: any, userId: string) {
    const newBrand = await BrandModel.create(data);

    const user = await UserModel.findByIdAndUpdate(userId, { $set: { brand: newBrand._id } }, { new: true });

    if (!user) {
      throw boom.notFound(`User #${userId} not found`);
    }

    return newBrand;
  }

  async update(id: string, change: any) {
    const updateBrand = await BrandModel.findByIdAndUpdate(id, change, {
      new: true,
    });
    if (!updateBrand) {
      throw boom.notFound(`brand #${id} not found`);
    }
    return updateBrand;
  }

  async remove(id: string) {
    const foundBrand = await BrandModel.findByIdAndDelete(id);
    if (!foundBrand) {
      throw boom.notFound(`brand #${id} not found`);
    }

    const questionnaireIds = foundBrand.questionnaires.map((questionnaire) => questionnaire._id);
    await QuestionnaireModel.deleteMany({ _id: { $in: questionnaireIds } });
  }

  async getStatistics(brandId: string) {
    await this.findOne(brandId);

    return await statisticService.getStatistics(brandId);
  }
}
