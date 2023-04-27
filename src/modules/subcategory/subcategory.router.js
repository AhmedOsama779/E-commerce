import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import { updateSubCategorySchema } from "./subcategory.validation.js";
import * as controllers from './subcategpry.controller.js'
import brandRouter from '../brand/brand.router.js'
import auth from "../../middleware/auth.js";
import { endPoints } from "../category/category.endPoint.js";
const router = Router({ mergeParams: true })

router.use('/:subCategoryId/brand', brandRouter)
router.post('/add', auth(endPoints.CREATE_CATEGORY), fileUpload({}).single('image'), asyncHandler(controllers.creatSubCategory))
router.put('/:subCategoryId', auth(endPoints.UPDATE_CATEGORY), fileUpload({}).single('image'), validation(updateSubCategorySchema), asyncHandler(controllers.updateSubCategory))


export default router
