import * as boom from "@hapi/boom";

import { OptionModel } from "../models/option.model";

export class OptionService {
    constructor() {} 

    async create(data: any) {
        const option = new OptionModel(data);
        return await option.save();
    }

    async find(brandId: string) {
        const options = await OptionModel.find({ brandId }).select({brandId: 0})
        return options
    }

    async findOne(id: string) {
        const option = await OptionModel.findById(id).select({brandId: 0})
        if(!option) {
        throw boom.notFound(`option #${id} not found`);
        }
        return option
    }

    async update(change: any, id: string) {
        const updateOption = await OptionModel.findByIdAndUpdate(id, change, { new : true })
        if(!updateOption) {
        throw boom.notFound(`option #${id} not found`);
        } 
        return updateOption;
    }

    async remove(id: string) {
        const foundOption = await OptionModel.findById(id)
        if(!foundOption) {
          throw boom.notFound(`option #${id} not found`);
        }
        return await OptionModel.deleteOne({_id: id})
    }
}