import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import subCategoryRouter from '../subcategory/subcategory.router.js'
const router = Router({ caseSensitive: true })

import * as controllers from './category.controller.js'
import { endPoints } from "./category.endPoint.js";
import * as validators from './category.validation.js'


router.use('/:categoryId/subcategory', subCategoryRouter)

router.post('/', auth(endPoints.CREATE_CATEGORY), fileUpload({}).single('image'),
    validation(validators.createCategorySchema),
    asyncHandler(controllers.creatCategory))

router.put('/:categoryId',
    auth(endPoints.UPDATE_CATEGORY),
    fileUpload({}).single('image'),
    validation(validators.updateCategorySchema),
    asyncHandler(controllers.updateCategory))


router.get('/', asyncHandler(controllers.getAllCategories))
export default router



// category ==> /:categoryId/subCategory/ ===> subRouter