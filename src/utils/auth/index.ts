import passport from "passport";

import { localStrategy } from "./strategies/local.strategy";
import { jwtStrategy } from "./strategies/jwt.strategy";

export const initializeStrategies = () => {
    passport.use(localStrategy)
    passport.use(jwtStrategy)
}