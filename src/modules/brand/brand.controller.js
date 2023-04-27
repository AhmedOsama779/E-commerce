import { nanoid } from "nanoid"
import brandModel from "../../../DB/model/Brand.model.js"
import categoryModel from "../../../DB/model/Category.model.js"
import subCategoryModel from "../../../DB/model/Sub-Category.model.js"
import cloudinary from "../../utils/cloudinary.js"


// CATEGORY => SUBCAT => BRAND

export const addBrand = async (req, res, next) => {
    const { subCategoryId, categoryId } = req.params
    const { name } = req.body
    const subCategory = await subCategoryModel.findById(subCategoryId)
    const Category = await categoryModel.findById(categoryId)
    if (!subCategory) {
        return next(new Error('IN-VALIF SUB-CATEGORY ID', { cause: 400 }))
    }
    if (await brandModel.findOne({ name, subCategoryId: subCategoryId })) {
        return next(new Error('Already added', { cause: 400 }))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${Category.customId}/SubCategories/${subCategory.customId}/Brands/${customId}`
    })

    const brand = await brandModel.create({
        name, customId, logo: { path: secure_url, public_id }, subCategoryId,  createdBy: req.user._id,
    })
    if (!brand) {
        await cloudinary.uploader.destroy(public_id)
        return next(new Error("Fail", { cause: 500 }))
    }
    return res.status(201).json({ message: `Brand ${name} Added successfully`, brand })
}