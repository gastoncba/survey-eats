import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import UserModel from "../models/user.model";

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
    delete userJson.password
    return userJson;
  }
}
