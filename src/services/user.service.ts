import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import UserModel from "../models/User.model";

export class UserService {
  constructor() {}

  async create(data: any) {
    const foundUser = await this.findByEmail(data.email);

    if (foundUser) {
      throw boom.conflict(`email ${data.email} is repeated`);
    }

    const hash = await bcrypt.hash(data.password, 10);
    const user = new UserModel({ ...data, password: hash });
    const savedUser = await user.save();
    const userReturned = savedUser.toJSON()
    delete userReturned.password
    return userReturned;
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }
}
