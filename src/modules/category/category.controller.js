
import { nanoid } from "nanoid";
import slugify from "slugify"
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const creatCategory = async (req, res, next) => {
    const { name } = req.body
    const slug = slugify(name.toLowerCase(), '_')

    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
        // return res.status(400).json({ message: "category name already exist" })
        return next(new Error("category name already exist", { cause: 400 }))
    }
    // if (!req.file) {
    //     // return res.status(400).json({ message: "Please upload a picture" })
    //     return next(new Error("Please upload a picture", { cause: 400 }))
    // }
    const customId = nanoid(5)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`
    })
    const category = await categoryModel.create({
        name: name.toLowerCase(),
        slug,
        customId,
        Image: {
            path: secure_url,
            public_id
        },
        createdBy: req.user._id,
    })
    if (!category) {
        await cloudinary.uploader.destroy(public_id)
        return next(new Error("Fail", { cause: 500 }))
    }
    return res.status(201).json({ message: `Category ${name} Added successfully`, category })
}

export const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error('please enter valid id ', { cause: 400 }))
    }
    if (req.body.name) {
        if (category.name == req.body.name.toLowerCase()) {
            return next(new Error('please enter different category name', { cause: 400 }))
        }
        if (await categoryModel.findOne({ name: req.body.name.toLowerCase() })) {
            return next(new Error('duplicate category name', { cause: 400 }))
        }
        category.name = req.body.name.toLowerCase()
        category.slug = slugify(req.body.name.toLowerCase(), '_')
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.Image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`

        })
        category.Image = {
            path: secure_url,
            public_id
        }
    }
    category.updatedBy = req.user._id
    const savedCat = await category.save()
    return res.status(200).json({ message: "Done", savedCat })
}

export const getAllCategories = async (req, res, next) => {
    const Categories = await categoryModel.find({}).populate([{
        path: 'subCategories'
    }])
    console.log({ Categories });
    // console.log(Categories[0].toJSON());
    if (Categories.length) {
        return res.status(200).json({ message: "Done", Categories })
    }
    return res.status(200).json({ message: "empty" })
}

