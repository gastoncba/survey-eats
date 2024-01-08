import * as boom from "@hapi/boom";

import ConditionModel from "../models/condition.model";

export class ConditionService {
  constructor() {}

  async create(data: any) {
    const condition = new ConditionModel(data);
    return await condition.save();
  }

  async find(brandId: string) {
    const conditions = await ConditionModel.find({ brandId }).select({ brandId: 0 });
    return conditions;
  }

  async findOne(id: string) {
    const foundCondition = ConditionModel.findById(id).select({ brandId: 0 });

    if (!foundCondition) {
      throw boom.notFound(`condition #${id} not found`);
    }
    return foundCondition;
  }

  async update(change: any, id: string) {
    const updateCondition = await ConditionModel.findByIdAndUpdate(id, change, {
      new: true,
    });
    if (!updateCondition) {
      throw boom.notFound(`condition #${id} not found`);
    }
    return updateCondition;
  }

  async remove(id: string) {
    const foundCondition = await ConditionModel.findByIdAndDelete(id);
    if (!foundCondition) {
      throw boom.notFound(`condition #${id} not found`);
    }
  }
}
