import mongoose, { Schema } from "mongoose";

const OptionSchema = new Schema({
    value: String,
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    }
})

export const OptionModel = mongoose.model('Option', OptionSchema)

