import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload } from "../../utils/multer.js";
import { addBrand } from "./brand.controller.js";
import { addBrandSchema } from "./brand.validation.js";
const router = Router({ mergeParams: true })


router.post('/', fileUpload({}).single('image'),
    validation(addBrandSchema),
    asyncHandler(addBrand))


export default router