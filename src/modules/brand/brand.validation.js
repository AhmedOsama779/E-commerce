import { generalFields } from "../../middleware/validation.js";
import joi from 'joi'
export const addBrandSchema = joi.object({
    name: joi.string().min(4).max(30).required(),
    file: generalFields.file.required(),
    categoryId: joi.string().required(),
    subCategoryId: joi.string().required(),

}).required()