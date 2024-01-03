import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserService } from "./user.service";
import { EmailService } from "./email.service";
import { config } from "../config/config";

const userService = UserService.getInstance();
const emailService = EmailService.getInstance();

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getUser(email: string, password: string) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      throw boom.unauthorized();
    }
    return user;
  }

  signToken(user: any) {
    const payload = {
      sub: user._id,
    };
    const { jwtSecret } = config;
    const userJson = user.toJSON();
    const { recoveryToken, password, ...userReturned } = userJson;
    const access_token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    return {
      user: userReturned,
      token: { access_token },
    };
  }

  async sendRecovery(email: string) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const { jwtSecret } = config;
    const payload = { sub: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "15m" });
    const link = `http://localhost:3000/recovery?token=${token}`;

    await userService.update(user.id, { recoveryToken: token });

    const subject = "Recuperar constraseña";
    const html = `<b>Ingrese a este link para recuperar tu constraseña</b><p>${link}</p>`;
    return await this.sendEmail(email, subject, html);
  }

  async changePassword(token: string, newPassword: string) {
    try {
      const payload: any = jwt.verify(token, config.jwtSecret);
      const user = await userService.findUserComplete(payload.sub);

      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await userService.update(user._id.toString(), { recoveryToken: null, password: hash });
      return { message: "password changed" };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendEmail(destinationEmail: string, subject?: string, html?: string) {
    return await emailService.sendEmail(destinationEmail, subject, html);
  }
}
