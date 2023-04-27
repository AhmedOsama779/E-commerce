

import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
export const updateSubCategorySchema = joi.object({
    name: joi.string().min(4).max(30).optional(),
    file: generalFields.file.optional(),
    categoryId: joi.string().required(),
    subCategoryId: joi.string().required(),
    // files: joi.array().items(generalFields.file.required()).required()
}).required()