import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import UserModel from "../models/user.model";
import { BrandsService } from "./brand.service";

const brandService = new BrandsService()

export class UserService {
  constructor() {}

  async create(data: any) {
    const foundUser = await this.findByEmail(data.email);

    if (foundUser) {
      throw boom.conflict(`email ${data.email} is repeated`);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = new UserModel({ ...data, password: hash });
    const savedUser = await (await user.save()).populate("brand");
    const userReturned = savedUser.toJSON();
    delete userReturned.password;
    return userReturned;
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email }).populate("brand");
  }

  async findById(userId: string) {
    const user = await UserModel.findById(userId).populate("brand");

    if (!user) {
      throw boom.notFound(`user #${userId} not found`);
    }

    const userJson = user.toJSON();
    const { recoveryToken, password, ...userReturned } = userJson;
    return userReturned;
  }

  async findUserComplete(userId: string) {
    const user = await UserModel.findById(userId).populate("brand");

    if (!user) {
      throw boom.notFound(`user #${userId} not found`);
    }

    const userJson = user.toJSON();
    return userJson;
  }

  async update(id: string, changes: any) {
    const updatedUser = await UserModel.findByIdAndUpdate(id, changes, {
      new: true,
    });
    if (!updatedUser) {
      throw boom.notFound(`user #${id} not found`);
    }
    return updatedUser;
  }

  async updateAll(userId: string, brandId: string, changes: { firstName?: string, lastName?: string, email?: string, brandName?: string}) {
    const { brandName, ...userChanges } = changes
    await brandService.update(brandId, { name: brandName })
    return await this.update(userId, userChanges)
  }
}
