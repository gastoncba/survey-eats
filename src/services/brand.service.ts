import * as boom from "@hapi/boom";
import QueryString from "qs";

import BrandModel from "../models/brand.model";

export class BrandsService {
  constructor() {}

  async find(query: QueryString.ParsedQs) {
    const { name } = query;

    const brands = await BrandModel.find(name ? { name } : {}).select({questionnaire: 0});
    return brands;
  }

  async findOne(id: string) {
    const brand = await BrandModel.findById(id).select({questionnaire: 0});;
    if (!brand) {
      throw boom.notFound(`brand #${id} not found`);
    }
    return brand;
  }

  async create(data: any) {
    const brand = new BrandModel(data);
    return await brand.save();
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
    const foundBrand = await BrandModel.findById(id);
    if (!foundBrand) {
      throw boom.notFound(`brand #${id} not found`);
    }
    return await BrandModel.deleteOne({ _id: id });
  }
}
