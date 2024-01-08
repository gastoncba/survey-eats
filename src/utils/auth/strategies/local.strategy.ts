import { Strategy } from "passport-local";

import { AuthService } from "../../../services/auth.service";

const authService = new AuthService();

export const localStrategy = new Strategy({ usernameField: "email" }, async (email: string, password: string, done) => {
  try {
    const user = await authService.getUser(email, password);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
