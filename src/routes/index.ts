import express, { Express } from "express";
import { router as questionRouter } from "./question.router";
import { router as optionRouter } from "./option.router";
import { router as brandRouter } from "./brand.router";
import { router as questionnaireRouter } from "./questionnaire.router";
import { router as questionChainRouter } from "./questionChain.router";
import { router as conditionRouter } from "./condition.router";
//import { router as giftRouter } from "./gift.router";

export const routerApi = (app: Express) => {
    const router = express.Router()
    app.use('/api', router)
    router.use('/questions', questionRouter)
    router.use('/options', optionRouter)
    router.use('/brands', brandRouter)
    router.use('/questionnaires', questionnaireRouter)
    router.use('/questionChains', questionChainRouter)
    router.use('/conditions', conditionRouter)
    //router.use('/gifts', giftRouter)
}