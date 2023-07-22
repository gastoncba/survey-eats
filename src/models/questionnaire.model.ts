import mongoose, { Schema } from "mongoose";

const QuestionnaireSchema = new Schema({
    name: String,
    questionChains: [
        {
            type: Schema.Types.ObjectId,
            ref: 'QuestionChain'
        }
    ]
})

const QuestionnaireModel = mongoose.model('Questionnaire', QuestionnaireSchema)

export default QuestionnaireModel;