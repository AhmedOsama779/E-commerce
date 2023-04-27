import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const updateCouponSchema = Joi.object({
    code: Joi.string().min(4).max(10).alphanum().optional(),
    amount: Joi.number().optional(),
    toDate: Joi.string().optional(),
    fromDate: Joi.string().optional(),
    // couponId: Joi.string().length(24).hex().required()  // _id
    couponId: generalFields.id,  // _id
}).required()