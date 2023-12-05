import { Strategy } from "passport-local";
import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import { UserService } from "../../../services/user.service";

const userService = new UserService();

export const localStrategy = new Strategy({ usernameField: "email" }, async (email: string, password: string, done) => {
  try {
    const user = await userService.findByEmail(email);
    if (!user) {
      done(boom.unauthorized(), false);
    }

    const isMatch = await bcrypt.compare(password, user?.password || "");
    if (!isMatch) {
      done(boom.unauthorized(), false);
    }
    done(null, user || {});
  } catch (error) {
    done(error, false);
  }
});
