import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";

import { config } from "../../../config/config";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

export const jwtStrategy = new Strategy(options, async (payload, done) => {
  return done(null, payload);
});
