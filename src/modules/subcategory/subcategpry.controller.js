





// amira ezaat   ==> amira-ezaat
// amiraezaat ==? amiraezaat
// slugify
import { nanoid } from "nanoid";
import slugify from "slugify"
import categoryModel from "../../../DB/model/Category.model.js";
import subCategoryModel from "../../../DB/model/Sub-Category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const creatSubCategory = async (req, res, next) => {
    // category
    console.log(req.originalUrl);
    const { categoryId } = req.params
    console.log(categoryId);

    const { name } = req.body
    const slug = slugify(name.toLowerCase(), '_')
    // console.log(slug);
    // slug = 5
    const category = await categoryModel.findById(categoryId)
    if (!category) {

        return next(new Error("category not found", { cause: 404 }))
    }
    if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
        return next(new Error("category name already exist", { cause: 400 }))
    }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`
    })
    const subCategory = await subCategoryModel.create({
        name: name.toLowerCase(),
        slug,
        customId,
        Image: {
            path: secure_url,
            public_id
        },
        categoryId,
        createdBy: req.user._id,
    })
    if (!subCategory) {
        await cloudinary.uploader.destroy(public_id)
        return next(new Error("Fail", { cause: 500 }))
    }
    return res.status(201).json({ message: `Sub-Category ${name} Added successfully`, subCategory })
}


export const updateSubCategory = async (req, res, next) => {
    const { categoryId, subCategoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    const subCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
    if (!subCategory) {
        return next(new Error('please enter valid id ', { cause: 400 }))
    }
    if (req.body.name) {
        if (subCategory.name == req.body.name.toLowerCase()) {
            return next(new Error('please enter different category name', { cause: 400 }))
        }
        if (await subCategoryModel.findOne({ name: req.body.name.toLowerCase() })) {
            return next(new Error('duplicate category name', { cause: 400 }))
        }
        subCategory.name = req.body.name.toLowerCase()
        subCategory.slug = slugify(req.body.name.toLowerCase(), '_')
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.Image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}/SubCategories/${subCategory.customId}`

        })
        subCategory.Image = {
            path: secure_url,
            public_id
        }
    }
    const savedCat = await subCategory.save()
    return res.status(200).json({ message: "Done", savedCat })
}
