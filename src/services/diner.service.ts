import mongoose from "mongoose";

import DinerModel from "../models/diner.model";

export class DinersServices {
  private static instance: DinersServices;

  private constructor() {}

  public static getInstance(): DinersServices {
    if (!DinersServices.instance) {
      DinersServices.instance = new DinersServices();
    }
    return DinersServices.instance;
  }

  async exists(email: string) {
    const diner = await DinerModel.findOne({ email });

    if (!diner) {
      return false
    }

    return true
  }

  async create(email: string, brandId: string) {
    const newDiner = new DinerModel({ email })
    const newObjectBrandId = new mongoose.Types.ObjectId(brandId)

    newDiner.brandsVisited.push(newObjectBrandId)
    await newDiner.save()
  }

  async visited(email: string, brandId: string) {
    const diner = await DinerModel.findOne({ email });

    if (!diner) {
        return false
    }
    return diner.brandsVisited.some((visitedBrandId) => visitedBrandId.equals(brandId));
  }

  async addBrand(email: string, brandId: string) {
    const diner = await DinerModel.findOne({ email });
    const newObjectBrandId = new mongoose.Types.ObjectId(brandId)

    if (diner) {
        diner.brandsVisited.push(newObjectBrandId);
        await diner.save();
    }
  }
}
