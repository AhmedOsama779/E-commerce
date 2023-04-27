import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controllers from './auth.controller.js'
import { logInSchema, signUpSchema } from "./auth.validation.js";
const router = Router()




router.post('/signUp', validation(signUpSchema), asyncHandler(controllers.signUp))
router.get('/confirmEmail/:token', asyncHandler(controllers.confirmEmail))

router.post('/login', validation(logInSchema), asyncHandler(controllers.login))
router.patch('/sendCode' , asyncHandler(controllers.sendCode))
router.patch('/reset' , asyncHandler(controllers.resetPassword))
export default router