import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controllers from './coupon.controller.js'
import * as validators from "./coupon.validation.js";
const router = Router()


router.post('/', auth(), asyncHandler(controllers.createCoupon))
router.put('/:couponId', validation(validators.updateCouponSchema), asyncHandler(controllers.updateCoupon))

export default router